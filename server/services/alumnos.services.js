"use strict";
import db from '../config/db.js';

export const getAlumnosService = async () => {
    try {
        const [result] = await db.query("SELECT * FROM alumnos");
        if(!result || result.length === 0) return [null, "No hay alumnos registrados"];
        return [result, null];
    } catch (error) {
        console.error("Error al obtener alumnos:", error);
        return [null, "Error interno del servidor"];
    }
};

export const getAlumnoService = async ( id ) => {
    try {
        const [result] = await db.query("SELECT * FROM alumnos WHERE id_alumno = ?", id);
        if (!result || result.length === 0) return [null, "No se encontró al alumno"];
        return [result[0], null];
    } catch (error) {
        console.error("Error al obtener alumno", error);
        return [null, "Error interno del servidor"];
    }
}

export const createAlumnoService = async ( body ) => {
    try {
        const { nombre, rut, carrera, facultad, departamento } = body;
        const [existeAlumno] = await db.query("SELECT * FROM alumnos WHERE rut = ?", rut);

        if(existeAlumno[0]) return [null, "Ya existe un alumno con el rut ingresado"];

        const [result] = await db.query("INSERT INTO alumnos (nombre, rut, carrera, facultad, departamento) VALUES (?, ?, ?, ?, ?)", [nombre, rut, carrera, facultad, departamento]);
        if(result.affectedRows === 0) return [null, "Error en la creación"];

        const [created] = await db.query("SELECT * FROM alumnos WHERE rut = ?", rut);
        if(!created) return [null, "Alumno no encontrado despues de ser creado"];

        return [created, null];
    } catch (error) {
        console.error("Error al crear un alumno", error);
        return [null, "Error interno del servidor"];
    }
}

export const updateAlumnoService = async ( body, id ) => {
    try {
        const [actualizarAlumno] = await db.query("SELECT * FROM alumnos WHERE id_alumno = ?", id);
        if(!actualizarAlumno || actualizarAlumno.length === 0) return [null, "No se encontró al alumno"];

        const [existeAlumno] = await db.query("SELECT * FROM alumnos WHERE rut = ?", body.rut);

        if(existeAlumno[0] && existeAlumno[0].rut !== actualizarAlumno[0].rut) 
            return [null, "Ya existe un alumno con el rut ingresado"];

        await db.query("UPDATE alumnos SET ? WHERE id_alumno = ?", [body, id]);

        const [alumno] = await db.query("SELECT * FROM alumnos WHERE id_alumno = ?", id);
        if(!alumno) return [null, "Alumno no encontrado despues de actualizar"];

        return [alumno[0], null];
    } catch (error) {
        console.error("Error al modificar al alumno", error);
        return [null, "Error interno del servidor"];
    }
}

export const deleteAlumnoService = async ( id ) => {
    try {
        const [result] = await db.query("SELECT * FROM alumnos WHERE id_alumno = ?", id);
        if (!result || result.length === 0) return [null, "No se encontró al alumno"];
        const [deleted] = await db.query("DELETE FROM alumnos WHERE id_alumno = ?", id);
        if(deleted.affectedRows === 0) return [null, "No se pudo borrar al alumno"];
        return [result[0], null];
    } catch (error) {
        console.error("Error eliminando al alumnos", error);
        return [null, "Error interno del servidor"];
    }
}