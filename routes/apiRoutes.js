const express = require("express");
const axios = require("axios");
const router = express.Router();

// Buscar libros
router.get("/books", async (req, res) => {
  const { query } = req.query;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;

  try {
    const response = await axios.get(url);
    res.render("books", { books: response.data.items });
  } catch (error) {
    res.send("Error al buscar libros");
  }
});

module.exports = router;

router.post("/save", async (req, res) => {
    const { title, authors } = req.body;
    const user_id = req.session.user.id;
  
    await pool.query("INSERT INTO saved_books (user_id, title, authors) VALUES ($1, $2, $3)", [user_id, title, authors]);
    res.redirect("/books");
  });
  