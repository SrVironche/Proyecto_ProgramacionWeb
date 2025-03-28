const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../models/db");
const router = express.Router();

// Página de registro
router.get("/register", (req, res) => {
  res.render("register"); // Asegúrate de que esté renderizando el archivo correcto
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Validar que los campos no estén vacíos
  if (!username || !email || !password) {
    return res.status(400).send("Todos los campos son requeridos");
  }

  // Verificar si el username ya está en uso
  const userExists = await pool.query("SELECT * FROM usuarios WHERE username = $1", [username]);

  if (userExists.rows.length > 0) {
    return res.status(400).send("El nombre de usuario ya está en uso");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query("INSERT INTO usuarios (username, email, contrasena) VALUES ($1, $2, $3)", [username, email, hashedPassword]);
    res.redirect("/auth/login"); // Redirige a la página de login después de registrarse
  } catch (error) {
    console.error(error); // Muestra el error en la consola para depuración
    res.send("Error al registrar");
  }
});


// Página de login
router.get("/login", (req, res) => {
  res.render("login"); // Asegúrate de que esté renderizando el archivo correcto
});

// Procesar login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  // Modificado para usar 'usuarios' y 'contrasena'
  const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

  if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].contrasena)) {
    req.session.user = user.rows[0]; // Guarda la sesión del usuario
    res.redirect("/dashboard"); // Redirige a un dashboard o página principal
  } else {
    res.send("Credenciales incorrectas");
  }
});

// Cerrar sesión
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login"); // Redirige a la página de login después de cerrar sesión
  });
});
router.get("/dashboard", (req, res) => {
  // Verificar si el usuario está autenticado
  if (req.session.user) {
    res.render("dashboard", { user: req.session.user });  // Renderiza la vista de dashboard
  } else {
    res.redirect("/auth/login");  // Si no está autenticado, redirigir al login
  }
});

module.exports = router;
