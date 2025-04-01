const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../models/db");
const axios = require("axios");

const router = express.Router();
const API_KEY = "AIzaSyBAPK_p4VMQAR526ivYOiYAU-04E-uWBE0";

// Ruta para buscar libros en Google Books
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send("Debes proporcionar un término de búsqueda.");
  }

  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`);
    res.render("searchResults", { books: response.data.items });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los libros.");
  }
});


// Página de registro
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Todos los campos son requeridos");
  }

  const userExists = await pool.query("SELECT * FROM usuarios WHERE username = $1", [username]);

  if (userExists.rows.length > 0) {
    return res.status(400).send("El nombre de usuario ya está en uso");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query("INSERT INTO usuarios (username, email, contrasena) VALUES ($1, $2, $3)", [username, email, hashedPassword]);
    res.redirect("/auth/login");
  } catch (error) {
    console.error(error);
    res.send("Error al registrar");
  }
});

// Página de login
router.get("/login", (req, res) => {
  res.render("login");
});

// Procesar login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

  if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].contrasena)) {
    req.session.user = user.rows[0];
    res.redirect("/auth/dashboard");
  } else {
    res.send("Credenciales incorrectas");
  }
});

// Cerrar sesión
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

router.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.render("dashboard", { user: req.session.user });
  } else {
    res.redirect("/auth/login");
  }
});

module.exports = router;
