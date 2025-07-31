"use strict";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import { getCarrerasService } from "../services/carreras.service.js";

export const getCarreras = async (req, res) => {
  try {
    const [carreras, errorCarreras] = await getCarrerasService();
    if (errorCarreras) return handleErrorClient(res, 404, errorCarreras);
    carreras.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Registro de carreras encontrado", carreras);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};
