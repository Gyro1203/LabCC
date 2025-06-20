"use strict";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { createAsistenciaService, deleteAsistenciaService, getAsistenciaService, getAsistenciasService, marcarSalidaService, updateAsistenciaService } from "../services/asistencias.services.js";

export const getAsistencias = async (req, res) => {
  try {
    const [asistencias, errorAsistencias] = await getAsistenciasService();
    if(errorAsistencias) handleErrorClient(res, 404, errorAsistencias);
    handleSuccess(res, 200, "Registro de asistencias encontrado", asistencias);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const getAsistencia = async (req, res) => {
  try {
    const [asistencia, errorAsistencia] = await getAsistenciaService(req.params.id);
    if (errorAsistencia) return handleErrorClient(res, 404, errorAsistencia);
    handleSuccess(res, 200, "Asistencia encontrada", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const createAsistencia = async (req, res) => {
  try {
    const { rut, jornada, actividad } = req.body;
    const [asistencia, errorAsistencia] = await createAsistenciaService( { rut, jornada, actividad } );
    if (errorAsistencia) return handleErrorClient(res, 400, errorAsistencia);
    handleSuccess(res, 201,"Asistencia creada exitosamente", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const updateAsistencia = async (req, res) => {
  try {
    const [asistencia, errorAsistencia] = await updateAsistenciaService(req.body, req.params.id);
    if (errorAsistencia) return handleErrorClient(res, 400, errorAsistencia);
    handleSuccess(res, 200, "Asistencia actualizada", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const marcarSalida = async (req, res) => {
  //Probar PATCH en lugar de PUT
  try {
    const [asistencia, errorAsistencia] = await marcarSalidaService(req.params.id);
    if (errorAsistencia) return handleErrorClient(res, 404, errorAsistencia);
    handleSuccess(res, 200, "Salida marcada", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const deleteAsistencia = async (req, res) => {
  try {
    const [asistencia, errorAsistencia] = await deleteAsistenciaService(req.params.id);
    if (errorAsistencia) return handleErrorClient(res, 404, errorAsistencia);
    handleSuccess(res, 200, "Asistencia eliminada", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};
