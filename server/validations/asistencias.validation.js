"use strict";
import Joi from "joi";

export const asistenciaBodyValidation = Joi.object({
  id_asistencia: Joi.number().integer().min(1).messages({
    "number.base": "El ID de la asistencia debe ser un número.",
    "number.integer": "El ID de la asistencia debe ser un número entero.",
    "number.min": "El ID de la asistencia debe ser mayor o igual a 1.",
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
  actividad: Joi.string().allow(""),
  fecha: Joi.string()
    .optional()
    .allow("")
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      "string.pattern.base": "La fecha debe tener el formato YYYY-MM-DD.",
    }),
  entrada: Joi.string()
    .optional()
    .allow("")
    .pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
    .messages({
      "string.pattern.base": "La hora de entrada debe tener el formato HH:mm.",
    }),
  salida: Joi.string()
    .optional()
    .allow("")
    .pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
    .messages({
      "string.pattern.base": "La hora de salida debe tener el formato HH:mm.",
    }),
});
