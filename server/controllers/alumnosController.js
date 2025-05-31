"use strict";
import db from '../config/db.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';
import { getAlumnosService } from '../services/alumnos.services.js';

export const getAlumnos = async (req, res) => {
    try {
        const [alumnos, errorAlumnos] = await getAlumnosService();
        if(errorAlumnos) return handleErrorClient(res, 404, errorAlumnos.message)
        alumnos.length === 0 
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Registro de alumnos encontrado", alumnos);
    } catch (error) {
        console.error("Error al obtener alumnos", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const getAlumno = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM alumnos WHERE id_alumno = ?", [req.params.id]);
        if (result.length <= 0) return handleErrorClient(res, 404, "No se encontró al alumno");
        handleSuccess(res, 200, "Alumno encontrado", result[0]);
    } catch (error) {
        console.error("Error al obtener alumno", error);
        handleErrorServer(res, 500, error.message);
    }
};


export const createAlumno = async (req, res) => {
    try {
        const { nombre, rut, carrera, facultad, departamento } = req.body;
        const [result] = await db.query("INSERT INTO alumnos (nombre, rut, carrera, facultad, departamento) VALUES (?, ?, ?, ?, ?)", [nombre, rut, carrera, facultad, departamento]);
        console.log(result);
        handleSuccess(
            res,
            201,
            "Alumno creado exitosamente",
            { id: result.insertId, nombre, rut, carrera, facultad, departamento}
        );
        //res.status(201).json({ id: result.insertId, nombre, rut, carrera, facultad, departamento });
    } catch (error) {
        console.error("Error al crear un alumno", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const updateAlumno = async (req, res) => {
    try {
        const [result] = await db.query("UPDATE alumnos SET ? WHERE id_alumno = ?", [req.body, req.params.id]);
        console.log(result);
        if (result.affectedRows === 0) return    handleErrorClient(res, 404, "No se encontró al alumno");
        handleSuccess(res, 200, "Datos del alumno actualizados", result);
        //Corregir, buscar por id, mostrar datos nuevos.
    } catch (error) {
        console.error("Error al modificar al alumno", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const deleteAlumno = async (req,res) => {
    try {
        const [result] = await db.query("DELETE FROM alumnos WHERE id_alumno = ?", [req.params.id]);
        if (result.affectedRows === 0) return handleErrorClient(res, 404, "Error elimando al alumno", "No se encontró al alumno");
        handleSuccess(res, 200, "Se elimino el registro del alumno exitosamente");
    } catch (error) {
        console.error("Error eliminando al alumnos", error);
        handleErrorServer(res, 500, error.message);
    }
};