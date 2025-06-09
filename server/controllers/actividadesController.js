"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';
import { createActividadService, deleteActividadService, getActividadByIngresoService, getActividadesService, getActividadService, updateActividadService } from '../services/actividades.services.js';

export const getActividades = async (req, res) => {
    try {
        const [actividades, erroActividades] = await getActividadesService();
        if (erroActividades) return handleErrorClient(res, 404, erroActividades); 
        handleSuccess(res, 200, "Registro de actividades encontrado", actividades);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export const getActividad = async (req, res) => {
    try {
        const [actividad, errorActividad] = await getActividadService(req.params.id);
        if (errorActividad) return handleErrorClient(res, 404, errorActividad);
        handleSuccess(res, 200, "Actividad encontrada", actividad);
    } catch (error) {
        return handleErrorServer(res, 500, error.message);
    }
};

export const getActividadByIngreso = async (req, res) => {
    try {
        const [actividades, errorActividades] = await getActividadByIngresoService(req.params.id);
        if (errorActividades) return handleErrorClient(res, 404, errorActividades);
        handleSuccess(res, 200, "Actividad encontrada", actividades);
    } catch (error) {
        return handleErrorServer(res, 500, error.message);
    }
};

export const createActividad = async (req, res) => {
    try {
        const { cantidad, observaciones, actividad_ensayo, actividad_ingreso } = req.body;
        const [actividad, errorActividad] = await createActividadService({ cantidad, observaciones, actividad_ensayo, actividad_ingreso });
        if (errorActividad) return handleErrorClient(res, 400, errorActividad);
        handleSuccess(res, 201, "Actividad creada exitosamente", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export const updateActividad = async (req, res) => {
    try {
        const [actividad, errorActividad] = await updateActividadService(req.body, req.params.id);
        if (errorActividad) return handleErrorClient(res, 400, errorActividad);
        handleSuccess(res, 200, "Actividad actualizada exitosamente", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export const deleteActividad = async (req,res) => {
    try {
        const [actividad, errorActividad] = await deleteActividadService(req.params.id);
        if (errorActividad) return handleErrorClient(res, 404, errorActividad);
        handleSuccess(res, 200, "Actividad eliminada exitosamente", actividad);
    } catch (error) {
        return handleErrorServer(res, 500, error.message);
    }
};