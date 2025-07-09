"use strict";
import { ACCESS_TOKEN_SECRET } from '../config/configEnv.js';
import db from '../config/db.js';
import { comparePassword } from '../helpers/bcrypt.helper.js';
import jwt from "jsonwebtoken";

export const loginService = async (body) => {
    try{
        
        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message
            });
        
        const [userFound] = await db.query("SELECT * FROM usuarios WHERE email = ?", body.email);

        if (!userFound || userFound.length === 0) return[null, "El correo electronico es incorrecto"];

        const isMatch = await comparePassword(body.password, userFound[0].password);

        if(!isMatch) return [null, createErrorMessage("password", "La contraseña es incorrecta")];

        const payload = {
            id: userFound[0].id_usuario,
            nombre_usuario: userFound[0].nombre_usuario,
            rol: userFound[0].rol,
            email: userFound[0].email
        }

        const accesToken = jwt.sign(payload, ACCESS_TOKEN_SECRET,{
            expiresIn: "7d",
        })

        return [accesToken, null];

    }catch(error){

        console.error("Error al iniciar sesión:", error);
        return[null, "Error interno del servidor"];
    }
}
