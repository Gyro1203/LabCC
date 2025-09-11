"use strict";
import Joi from 'joi';

const ingresoBodyValidation = Joi.object({
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
    motivo: Joi.string()
    .valid("Seminario Aplicado", "Tesis o Proyecto de Título", "Proyecto de Investigación", "Práctica I", "Práctica II", "Práctica III", "Otro")
    .messages({
      "any.only": "El motivo debe ser uno de los siguientes: Seminario Aplicado, Tesis o Proyecto de Título, Proyecto de Investigación, Práctica I, Práctica II, Práctica III, Otro.",
    }),
    titulo: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9-ZáéíóúÁÉÍÓÚñÑ\s.,;:!?-]+$/)
    .pattern(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/) // Debe contener al menos una letra
    .messages({
      "string.min": "El título debe tener al menos 1 carácter.",
      "string.max": "El título no puede exceder los 100 caracteres.",
      "string.pattern.base": "El título debe contener al menos una letra y solo puede incluir letras, números, espacios y algunos caracteres especiales como .,;:!?-.",
    }),
    
})