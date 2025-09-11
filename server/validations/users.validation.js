"use strict";
import Joi from 'joi';

export const userBodyValidation = Joi.object({
    nombre_usuario: Joi.string()
    .min(4)
    .max(20)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
        "string.min": "El nombre de usuario debe tener al menos 4 caracteres.",
        "string.max": "El nombre de usuario no puede exceder los 20 caracteres.",
        "string.pattern.base": "El nombre de usuario solo puede contener letras y espacios.",
    }),
    rol: Joi.string()
    .min(4)
    .max(20)
    .valid("Admin", "Encargado Lab")
    .messages({
        "string.min": "El rol debe tener al menos 4 caracteres.",
        "string.max": "El rol no puede exceder los 20 caracteres.",
        "any.only": "El rol debe ser 'Admin' o 'Encargado Lab'.",
    }),
    email: Joi.string()
    .email()
    .messages({
        "string.email": "El email debe ser un correo electrónico válido.",
    }),
    password: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .messages({
        "string.min": "La contraseña debe tener al menos 8 caracteres.",
        "string.max": "La contraseña no puede exceder los 26 caracteres.",
        "string.pattern.base": "La contraseña solo puede contener letras, números.",
    }),
})
