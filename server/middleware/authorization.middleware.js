import db from "../config/db.js";
import { handleErrorClient, handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";

export async function isAdmin(req, res, next){
    try{
        const userFound = await db.query("SELECT * FROM usuarios WHERE email = ?", req.user.email);
         if (!userFound || userFound.length === 0) { return handleErrorClient
         (res, 404, "Usuario no encontrado en la base de datos");
         }
         const rolUser = userFound.rol;
         if (rolUser !== "admin"){
            return handleErrorClient
            (res, 403, "Error al acceder al recurso", "Se requiere rol de administrador para realizar esta accion.");
         }
         next();
    }catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

