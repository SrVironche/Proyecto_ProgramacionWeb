const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", // Usuario de PostgreSQL
  host: "localhost",
  database: "proyecto_final",
  password: "123", // Contraseña de PostgreSQL
  port: 5432, // Puerto por defecto de PostgreSQL
});

module.exports = pool;
