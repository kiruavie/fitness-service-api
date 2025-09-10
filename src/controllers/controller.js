const { PrismaClient } = require("@prisma/client");
const { createUserSchema } = require("../schemas/userSchema");
const { createWorkoutSchema } = require("../schemas/workutSchema");

const prisma = new PrismaClient();

async function createUser(req, res) {
  const { error, value } = createUserSchema.validate(req.body, {
    abortEarly: false, // retourne toutes les erreurs
    stripUnknown: true, // enlève les champs non attendus
  });

  if (error) {
    return res.status(400).json({
      message: "Validation échouée",
      details: error.details.map((d) => d.message),
    });
  }
  try {
    const existing = await prisma.user.findUnique({
      where: { email: value.email },
    });
    if (existing) {
      return res.status(400).json("L'adresse email existe déjà");
    }
    const user = await prisma.user.create({ data: value });
    return res.status(201).json({
      message: "Utilisateur enregistré avec success",
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target.includes("email")) {
      return res.status(400).json({
        message: "Un utilisateur avec cet email existe déjà",
      });
    }
    console.error("Erreur prisma", error);

    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) return res.status(404).json("Utilisateur introuvable");

  return res.status(200).json({ message: "Utilisateur trouvé", data: user });
}

async function createWorkout(req, res) {
  const { error, value } = createWorkoutSchema.validate(req.body, {
    abortEarly: false, // retourne toutes les erreurs
    stripUnknown: true, // enlève les champs non attendus
  });

  if (error) {
    return res.status(400).json({
      message: "Validation échouée",
      details: error.details.map((d) => d.message),
    });
  }

  try {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }
    const workut = await prisma.workout.create({ data: value });

    res.status(201).json({
      success: true,
      message: "entrainement de l'utilisateur crée avec succès",
      data: workut,
    });
  } catch (error) {
    console.error("Erreur prisma", error);

    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

async function getUserWorkouts(req, res) {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    // Récupérer les entraînements de l'utilisateur
    const workouts = await prisma.workout.findMany({
      where: { userId: id },
    });

    res.status(200).json({
      message: "Entraînements récupérés avec succès",
      data: workouts,
    });
  } catch (error) {
    console.error("Erreur prisma", error);

    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

// Voir tous les utilisateurs
async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.render("users", { users });

    res.status(200).json({
      message: "Tous les utilisateurs sont ici",
      data: users,
    });
  } catch (error) {
    console.error("Erreur prisma", error);

    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

async function getUserStats(req, res) {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    // Récupérer tous les entraînements de l'utilisateur
    const workouts = await prisma.workout.findMany({
      where: { userId: id },
    });

    // Calculer les statistiques
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce(
      (sum, workout) => sum + workout.duration,
      0
    );
    const averageDuration =
      totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    // Statistiques par type d'entraînement
    const statsByType = workouts.reduce((stats, workout) => {
      const type = workout.type;
      if (!stats[type]) {
        stats[type] = { count: 0, totalDuration: 0 };
      }
      stats[type].count++;
      stats[type].totalDuration += workout.duration;
      return stats;
    }, {});

    // Calculer la moyenne par type
    Object.keys(statsByType).forEach((type) => {
      statsByType[type].averageDuration = Math.round(
        statsByType[type].totalDuration / statsByType[type].count
      );
    });

    const stats = {
      totalWorkouts,
      totalDuration,
      averageDuration,
      statsByType,
    };

    res.status(200).json({
      message: "Statistiques récupérées avec succès",
      data: stats,
    });
  } catch (error) {
    console.error("Erreur prisma", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

module.exports = {
  createUser,
  getUserById,
  createWorkout,
  getAllUsers,
  getUserWorkouts,
  getUserStats,
};
