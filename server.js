const express = require("express");
const session = require("express-session");
const app = express();
const authRoutes = require("./routes/authRoutes"); // Asegúrate de que la ruta sea correcta

// Configurar el middleware de sesión
app.use(session({
  secret: 'mi_secreto', // Cambia esta clave por algo más seguro
  resave: false,
  saveUninitialized: true
}));

// Middleware para parsear datos de los formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Usar las rutas de autenticación
app.use("/auth", authRoutes);  // Esto debería ser correcto

// Servir vistas (asegúrate de que EJS está configurado)
app.set("view engine", "ejs");
app.set("views", "views");

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
