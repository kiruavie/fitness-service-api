const express = require("express");
const cors = require("cors");
const {
  createUser,
  getUserById,
  createWorkout,
  getUserWorkouts,
  getUserStats,
  getAllUsers,
} = require("./src/controllers/controller.js");
const app = express();
const usersRoute = express.Router();
const workoutsRoute = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// middleware pour les routes
app.use("/users", usersRoute);
app.use("/workouts", workoutsRoute);

// page d'accueil
app.get("/", (req, res) => {
  res.render("index", {
    message: "Gestion des entrainements fitness des utilisateurs",
  });
});

// routes

// créer un utilisateur
usersRoute.post("/add", createUser);

// voir tous les utilisateurs
usersRoute.get("/all", getAllUsers);

// récupérer un utilisateur par ID
usersRoute.get("/:id", getUserById);

// créer un workout
workoutsRoute.post("/", createWorkout);

// lister tous les entraînements d’un utilisateur
usersRoute.get("/:id/workouts", getUserWorkouts);

// stats utilisateur
usersRoute.get("/:id/stats", getUserStats);

module.exports = app;
