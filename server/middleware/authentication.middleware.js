"use strict";
import passport from "passport";
import { handleErrorClient, handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";

export function authenticateJwt(req, res, next){
    passport.authenticate("jwt", {session: false}, (err, user, info) => {
        if(err) {
            return handleErrorServer(res, 500, "Error en la autenticacion del servidor");
        }
        if (!user) {
            return handleErrorClient(res, 401, "No tienes permiso para acceder a este recurso",
                { info: info ? info.message : "No se encontro el usuario" }
            );
        }

        req.user = user;
        next();
    })(req, res, next);
}