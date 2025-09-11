"use strict";
import Joi from "joi";

export const ensayoBodyValidation = Joi.object({
  id_ensayo: Joi.number().integer().min(1).messages({
    "number.base": "El ID del alumno debe ser un número.",
    "number.integer": "El ID del alumno debe ser un número entero.",
    "number.min": "El ID del alumno debe ser mayor o igual a 1.",
  }),
  actividad: Joi.string()
    .max(30)
    .pattern(/^[a-zA-Z0-9-ZáéíóúÁÉÍÓÚñÑ\s.,;:!?-]+$/)
    .pattern(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/) // Debe contener al menos una letra
    .messages({
      "string.empty": "La actividad es obligatoria.",
      "string.max": "La actividad no puede exceder los 30 caracteres.",
      "string.pattern.base":
        "La actividad debe contener al menos una letra y solo puede incluir letras, números, espacios y algunos caracteres especiales como .,;:!?-.",
    }),
  area: Joi.string()
    .max(30)
    .pattern(/^[a-zA-Z0-9-ZáéíóúÁÉÍÓÚñÑ\s.,;:!?-]+$/)
    .pattern(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/)
    .messages({
      "string.empty": "El área es obligatoria.",
      "string.max": "El área no puede exceder los 30 caracteres.",
      "string.pattern.base":
        "El área debe contener al menos una letra y solo puede incluir letras, números, espacios y algunos caracteres especiales como .,;:!?-.",
    }),
  unidad: Joi.string()
    .min(1)
    .max(10)
    .pattern(/^[a-zA-Z0-9-ZáéíóúÁÉÍÓÚñÑ\s.,;:!?-]+$/)
    .pattern(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/)
    .messages({
      "string.empty": "La unidad es obligatoria.",
      "string.min": "La unidad debe tener al menos 1 carácter.",
      "string.max": "La unidad no puede exceder los 3 caracteres.",
      "string.pattern.base":
        "La unidad debe contener al menos una letra y solo puede incluir letras, números, espacios y algunos caracteres especiales como .,;:!?-.",
    }),
  precio_uf: Joi.number().min(0).max(1000000).messages({
    "number.base": "El precio debe ser un número.",
    "number.min": "El precio no puede ser negativo.",
    "number.max": "El precio no puede exceder 1,000,000.",
  }),
});
