"use strict";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import {
  createEnsayoService,
  deleteEnsayoService,
  getEnsayoService,
  getEnsayosService,
  updateEnsayoService,
} from "../services/ensayos.services.js";

import { ensayoBodyValidation } from "../validations/ensayo.validations.js";

export const getEnsayos = async (req, res) => {
  try {
    const [ensayos, errorEsayos] = await getEnsayosService();
    if (errorEsayos) return handleErrorClient(res, 404, errorEsayos);
    handleSuccess(res, 200, "Registro de ensayo encontrado", ensayos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const getEnsayo = async (req, res) => {
  try {
    const [ensayo, errorEsayo] = await getEnsayoService(req.params.id);
    if (errorEsayo) return handleErrorClient(res, 404, errorEsayo);
    handleSuccess(res, 200, "Ensayo encontrado", ensayo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const createEnsayo = async (req, res) => {
  try {

    const { body } = req;
    const { error } = ensayoBodyValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.details[0].message);
    }

    const { actividad, area, unidad, norma, precio_uf } = req.body;
    const [ensayo, errorEnsayo] = await createEnsayoService({
      actividad,
      area,
      unidad,
      norma,
      precio_uf,
    });
    if (errorEnsayo) return handleErrorClient(res, 400, errorEnsayo);
    handleSuccess(res, 201, "Ensayo creado exitosamente", ensayo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const updateEnsayo = async (req, res) => {
  try {

    const { body } = req;
    const { error } = ensayoBodyValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.details[0].message);
    }
    
    const [ensayo, errorEnsayo] = await updateEnsayoService(
      req.body,
      req.params.id
    );
    if (errorEnsayo) return handleErrorClient(res, 400, errorEnsayo);
    handleSuccess(res, 200, "Información del ensayo actualizada", ensayo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const deleteEnsayo = async (req, res) => {
  try {
    const [ensayo, errorEnsayo] = await deleteEnsayoService(req.params.id);
    if (errorEnsayo) return handleErrorClient(res, 404, errorEnsayo);
    handleSuccess(res, 200, "Se elimino el ensayo correctamente", ensayo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};
