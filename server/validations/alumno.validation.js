"use strict";
import Joi from "joi";

export const alumnoBodyValidation = Joi.object({
  nombre: Joi.string()
    .min(4)
    .max(30)
    .pattern(/^[a-zA-Z-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre es obligatorio.",
      "string.min": "El nombre debe tener al menos 4 caracteres.",
      "string.max": "El nombre no puede exceder los 30 caracteres.",
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    }),
  rut: Joi.string()
    .pattern(
      /^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/
    )
    .min(9)
    .max(12)
    .messages({
      "string.pattern.base": "El RUT debe tener un formato válido.",
      "string.min": "El RUT debe tener al menos 9 caracteres.",
      "string.max": "El RUT no puede exceder los 12 caracteres.",
    }),
  estado: Joi.string().valid("Activo", "Inactivo", "Eliminado").messages({
    "any.only": "El estado debe ser 'Activo', 'Inactivo' o 'Eliminado'.",
  }),
  alumno_carrera: Joi.number().integer().min(1).messages({
    "number.base": "El ID de la carrera debe ser un número.",
    "number.integer": "El ID de la carrera debe ser un número entero.",
    "number.min": "El ID de la carrera debe ser mayor o igual a 1.",
  }),
});
