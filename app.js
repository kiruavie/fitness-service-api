const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded(true));

app.get("/", (req, res) => {
  res.json({ message: "Gestion des entrainements fitness des utilisateurs" });
});

module.exports = app;
