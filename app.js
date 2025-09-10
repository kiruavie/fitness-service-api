const express = require("express");
const cors = require("cors");
const {
  createUser,
  getUserById,
  createWorkout,
  getUserWorkouts,
  getUserStats,
} = require("./src/controllers/controller.js");
const app = express();
const usersRoute = express.Router();
const workoutsRoute = express.Router();

app.use(express.json());
app.use(express.urlencoded(true));
app.use(cors());

// middleware pour la route users
app.use("/users", usersRoute);

// iddleware pour la route workuts
app.use(workoutsRoute);

app.get("/", (req, res) => {
  res.json({ message: "Gestion des entrainements fitness des utilisateurs" });
});

// routes

// pour créer un utilisateur
usersRoute.post("/", createUser);

// recuprer les infos d'un utilisateur
usersRoute.get("/:id", getUserById);

// créer un workut pour un utillisateur
workoutsRoute.post("/workouts", createWorkout);

// lister tous les entraînements d’un utilisateur.
usersRoute.get("/:id/workouts", getUserWorkouts);

// GET /users/:id/stats → renvoyer des stats (total d’entraînements, durée totale, moyenne par
usersRoute.get("/:id/stats", getUserStats);

module.exports = app;
