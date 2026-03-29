"use strict";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import {
  getCarrerasService,
  getCarreraByIdService,
  createCarreraService,
  updateCarreraService,
  deleteCarreraService,
} from "../services/carreras.service.js";

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

// Obtener carrera por ID
export const getCarreraById = async (req, res) => {
  try {
    const { id } = req.params;
    const [carrera, errorCarrera] = await getCarreraByIdService(id);
    if (errorCarrera) return handleErrorClient(res, 404, errorCarrera);
    handleSuccess(res, 200, "Carrera encontrada", carrera);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

// Crear carrera
export const createCarrera = async (req, res) => {
  try {
    const { carrera, facultad, departamento } = req.body;
    if (!carrera || !facultad || !departamento)
      return handleErrorClient(res, 400, "Faltan campos obligatorios");
    const [id, error] = await createCarreraService(carrera, facultad, departamento);
    if (error) return handleErrorClient(res, 400, error);
    handleSuccess(res, 201, "Carrera creada correctamente", { id });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

// Actualizar carrera
export const updateCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const { carrera, facultad, departamento } = req.body;
    if (!carrera || !facultad || !departamento)
      return handleErrorClient(res, 400, "Faltan campos obligatorios");
    const [ok, error] = await updateCarreraService(id, carrera, facultad, departamento);
    if (error) return handleErrorClient(res, 404, error);
    handleSuccess(res, 200, "Carrera actualizada correctamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

// Eliminar carrera
export const deleteCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const [ok, error] = await deleteCarreraService(id);
    if (error) return handleErrorClient(res, 404, error);
    handleSuccess(res, 200, "Carrera eliminada correctamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};
