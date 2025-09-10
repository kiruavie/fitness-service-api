const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.min": "Le nom doit avoir au minimum 3 caractères",
    "any.required": "Le nom est obligatoire",
    "string.empty": "Le nom ne peut pas être vide",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Adresse email incorrecte",
    "any.required": "L'email est obligatoire",
    "string.empty": "L'email ne peut pas être vide",
  }),
});

const updateUserSchema = createUserSchema.optional();

module.exports = { createUserSchema, updateUserSchema };
