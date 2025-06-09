"use strict";
import db from '../config/db.js';

export const getAsistenciasService = async () => {
    try {
        const [result] = await db.query(`
            SELECT 
                asis.id_asistencia,
                al.nombre AS alumno, 
                asis.jornada, 
                asis.entrada, 
                ac.nombre AS actividad,
                asis.salida
            FROM asistencias asis 
            JOIN ingresos i ON asis.asistencia_ingreso = i.id_ingreso
            JOIN alumnos al ON i.ingreso_alumno = al.id_alumno
            JOIN actividades ac ON asis.asistencia_actividad = ac.id_actividad;
        `);
        if(!result || result.length === 0) return [null, "No se encontraron registros de asistencias"];
        return [result, null];
    } catch (error) {
        console.error("Error al obtener las asistencias", error);
        return [null, "Error interno del servidor"];
    }
};

export const getAsistenciaService = async ( id ) => {
    try {
        const [result] = await db.query(`
            SELECT 
                asis.id_asistencia,
                al.nombre AS alumno, 
                asis.jornada, 
                asis.entrada, 
                ac.nombre AS actividad,
                asis.salida,
                asis.asistencia_ingreso,
                asis.asistencia_actividad
            FROM asistencias asis 
            JOIN ingresos i ON asis.asistencia_ingreso = i.id_ingreso
            JOIN alumnos al ON i.ingreso_alumno = al.id_alumno
            JOIN actividades ac ON asis.asistencia_actividad = ac.id_actividad
            WHERE asis.id_asistencia = ?
        `, [id]);
        if (!result || result.length === 0) return [null, "Registro de asistencias no encontrado"];
        return [result[0], null];
    } catch (error) {
        console.error("Error al obtener la asistencia", error);
        return [null, "Error interno del servidor"];
    }
}

export const createAsistenciaService = async ( body ) => {
    try {
        const { jornada, asistencia_ingreso, asistencia_actividad } = body;
        
        const [ingreso] = await db.query("SELECT ingreso_alumno, vigente FROM ingresos WHERE id_ingreso = ?", asistencia_ingreso);
        if(!ingreso || ingreso.length === 0) return [null, "No se encontró el ingreso"];
        if(!ingreso[0].vigente) return [null, "El ingreso no se encuentra vigente"];

        const [actividad] = await db.query("SELECT nombre, actividad_ingreso FROM actividades WHERE id_actividad = ?", asistencia_actividad);
        if(!actividad || actividad.length === 0) return [null, "No se encontró la actividad"];
        if(actividad[0].actividad_ingreso !== asistencia_ingreso) return [null, "El registro de ingreso no contiene esta actividad"];

        const [alumno] = await db.query("SELECT nombre FROM alumnos WHERE id_alumno = ?", ingreso[0].ingreso_alumno);

        const nombre_alumno = alumno[0].nombre;
        const nombre_actividad = actividad[0].nombre;

        const [result] = await db.query(`
            INSERT INTO asistencias(
                nombre_alumno, 
                jornada,
                nombre_actividad,
                asistencia_ingreso,
                asistencia_actividad
            ) VALUES (?, ?, ?, ?, ?)
        `, [nombre_alumno, jornada, nombre_actividad, asistencia_ingreso, asistencia_actividad]);
        if(result.affectedRows === 0) return [null, "Error al registrar la asistencia"];

        const [created] = await db.query("SELECT * FROM asistencias WHERE id_asistencia = ?", result.insertId);
        if(!created) return [null, "No se encontró el registro de asistencia despues de su creación"];

        return [created[0], null];
    } catch (error) {
        console.error("Error al crear la asistencia", error);
        return [null, "Error interno del servidor"];
    }
}

export const updateAsistenciaService = async ( body, id ) => {
    try {
        const [actualizarAsistencia] = await db.query("SELECT * FROM asistencias WHERE id_asistencia = ?", id);
        if(!actualizarAsistencia || actualizarAsistencia.length === 0) return [null, "Registro de asistencia no encontrado"];
    
        const [ingreso] = await db.query("SELECT ingreso_alumno, vigente FROM ingresos WHERE id_ingreso = ?", body.asistencia_ingreso);
        if(!ingreso || ingreso.length === 0) return [null, "No se encontró el ingreso"];
        if(!ingreso[0].vigente) return [null, "El ingreso no se encuentra vigente"];

        const [actividad] = await db.query("SELECT nombre, actividad_ingreso FROM actividades WHERE id_actividad = ?", body.asistencia_actividad);
        if(!actividad || actividad.length === 0) return [null, "No se encontró la actividad"];
        if(actividad[0].actividad_ingreso !== body.asistencia_ingreso) return [null, "El registro de ingreso no contiene esta actividad"];

        const [alumno] = await db.query("SELECT nombre FROM alumnos WHERE id_alumno = ?", ingreso[0].ingreso_alumno);

        const nombre_alumno = alumno[0].nombre;
        const nombre_actividad = actividad[0].nombre;

        const result = await db.query(`
            UPDATE asistencias SET 
                nombre_alumno = ?, 
                jornada = ?, 
                nombre_actividad = ?, 
                asistencia_ingreso = ?, 
                asistencia_actividad = ?
            WHERE id_asistencia = ?`
            , [
                nombre_alumno, 
                body.jornada, 
                nombre_actividad, 
                body.asistencia_ingreso, 
                body.asistencia_actividad,
                id
            ]
        );
        if(result.affectedRows === 0) return [null, "Error al actualizar la asistencia"];

        const [asistencia] = await db.query("SELECT * FROM asistencias WHERE id_asistencia = ?", id);
        if(!asistencia) return [null, "No se encontró el registro de asistencia despues de actualizar"];

        return [asistencia[0], null];
    } catch (error) {
        console.error("Error al modificar la asistencia", error);
        return [null, "Error interno del servidor"];
    }
}

export const marcarSalidaService = async ( id ) => {
    try {
        const [result] = await db.query("UPDATE asistencias SET salida = CURRENT_TIMESTAMP WHERE id_asistencia = ?", [id]);
        if(result.affectedRows === 0) return [null, "No se encontró el registro de asistencia o ya se marcó la salida"];
        const [asistencia] = await db.query("SELECT * FROM asistencias WHERE id_asistencia = ?", [id]);
        if(!asistencia || asistencia.length === 0) return [null, "No se encontró el registro de asistencia despues de marcar la salida"];
        return [asistencia[0], null];
    } catch (error) {
        console.error("Error al marcar salida", error);
        return [null, "Error interno del servidor"];
    }
}

export const deleteAsistenciaService = async ( id ) => {
    try {
        const [result] = await db.query("SELECT * FROM asistencias WHERE id_asistencia = ?", id);
        if (!result || result.length === 0) return [null, "Registro de asistencia no encontrado"];
        const [deleted] = await db.query("DELETE FROM asistencias WHERE id_asistencia = ?", id);
        if(deleted.affectedRows === 0) return [null, "No se pudo borrar la asistencia"];
        return [result[0], null];
    } catch (error) {
        console.error("Error al eliminar la asistencia", error);
        return [null, "Error interno del servidor"];
    }
}