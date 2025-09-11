"use strict";
import Joi from "joi";

export const actividadBodyValdation = Joi.object({
  id_actividad: Joi.number().integer().min(1).messages({
    "number.base": "El ID de la actividad debe ser un número.",
    "number.integer": "El ID de la actividad debe ser un número entero.",
    "number.min": "El ID de la actividad debe ser mayor o igual a 1.",
  }),
  observaciones: Joi.string()
    .allow("")
    .max(500)
    .pattern(/^[a-zA-Z0-9-ZáéíóúÁÉÍÓÚñÑ\s.,;:!?-]+$/)
    .pattern(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/)
    .messages({
      "string.max": "Las observaciones no pueden exceder los 500 caracteres.",
      "string.pattern.base":
        "Las observaciones solo pueden contener letras, números, espacios y algunos caracteres especiales como .,;:!?-.",
    }),
  cantidad: Joi.number().integer().positive().messages({
    "number.base": "La cantidad debe ser un número.",
    "number.integer": "La cantidad debe ser un número entero.",
    "number.positive": "La cantidad debe ser un número positivo.",
  }),
  actividad_ensayo: Joi.number().integer().positive().messages({
    "number.base": "El ID de la actividad de ensayo debe ser un número.",
    "number.integer":
      "El ID de la actividad de ensayo debe ser un número entero.",
    "number.positive":
      "El ID de la actividad de ensayo debe ser un número positivo.",
  }),
  actividad_ingreso: Joi.number().integer().positive().messages({
    "number.base": "El ID de la actividad de ingreso debe ser un número.",
    "number.integer":
      "El ID de la actividad de ingreso debe ser un número entero.",
    "number.positive":
      "El ID de la actividad de ingreso debe ser un número positivo.",
  }),
});
