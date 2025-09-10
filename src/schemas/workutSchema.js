const Joi = require("joi");

const createWorkoutSchema = Joi.object({
  userId: Joi.string().required(),
  date: Joi.date(),
  type: Joi.string(),
  duration: Joi.number(),
});

const updateWorkoutSchema = createWorkoutSchema.optional();

module.exports = { createWorkoutSchema, updateWorkoutSchema };
