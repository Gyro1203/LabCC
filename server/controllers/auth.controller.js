"use strict";
import { loginService } from '../services/auth.service.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function loginController(req, res) {
    try{

        const { body } = req;
        const [accessToken, errorToken] = await loginService(body);
        if (errorToken) return handleErrorClient(res, 400, "Error iniciando sesión", errorToken);
        res.cookie("jwt", accessToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });
        handleSuccess(res, 200, "Inicio de sesión exitoso", { token: accessToken })

    }catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function logoutController(req, res) {
  try {
    res.clearCookie("jwt", { httpOnly: true });
    handleSuccess(res, 200, "Sesión cerrada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

