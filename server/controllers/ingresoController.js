"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';
import {
    getIngresosService, 
    getIngresoService, 
    createIngresoService, 
    updateIngresoService, 
    deleteIngresoService 
} from '../services/ingresos.services.js';

export const getIngresos = async (req, res) => {
    try {
        const [ingresos, errorIngresos] = await getIngresosService();
        if(errorIngresos) handleErrorClient(res, 404, errorIngresos);
        handleSuccess(res, 200, "Registro de ingresos encontrado", ingresos);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export const getIngreso = async (req, res) => {
    try {
        const [ingreso, errorIngreso] = await getIngresoService(req.params.id);
        if (errorIngreso) return handleErrorClient(res, 404, errorIngreso);
        handleSuccess(res, 200, "Ingreso encontrado", ingreso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export const getIngresoActividades = async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT
                a.nombre, 
                a.rut, 
                i.motivo, 
                i.titulo, 
                i.profesor_guia, 
                i.profesor_asignatura, 
                i.semestre,
                ac.nombre
            FROM ingresos i 
            JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
            JOIN actividades ac ON i.id_ingreso = ac.actividad_ingreso
            WHERE i.id_ingreso = ?
        `, [req.params.id]);
        if (result.length <= 0) return handleErrorClient(res, 404, "Ingreso solicitado no encontrado");
        handleSuccess(res, 200, "Actividades del ingreso encontradas", result);
    } catch (error) {
        console.error("Error al obtener las actividades del ingreso", error);
        handleErrorServer(res, 500, error.message);
    }
};


export const createIngreso = async (req, res) => {
    try {
        const { rut, motivo, titulo, profesor_guia, profesor_asignatura, semestre } = req.body;
        const [ingreso, errorIngreso] = await createIngresoService({ rut, motivo, titulo, profesor_guia, profesor_asignatura, semestre });
        if(errorIngreso) return handleErrorClient(res, 400, errorIngreso);   
        return handleSuccess(res, 201, "Ingreso registrado exitosamente", ingreso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export const updateIngreso = async (req, res) => {
    try {
        const [ingreso, errorIngreso] = await updateIngresoService(req.body, req.params.id);
        if(errorIngreso) return handleErrorClient(res, 400, errorIngreso);
        handleSuccess(res, 200, "Ingreso modificado exitosamente", ingreso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export const deleteIngreso = async (req,res) => {
    try {
        const [ingreso, errorIngreso] = await deleteIngresoService(req.params.id);
        if (errorIngreso) return handleErrorClient(res, 404, errorIngreso);
        handleSuccess(res, 200, "Ingreso eliminado exitosamente", ingreso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};