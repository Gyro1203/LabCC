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
                al.rut,
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

export const getAsistenciasByIngresoService = async ( id ) => {
    try {
        const [ingreso] = await db.query("SELECT id_ingreso FROM ingresos WHERE id_ingreso = ?", id);
        if(!ingreso || ingreso.length === 0) return [null, "No se encontró el ingreso"];
        const [result] = await db.query(`
            SELECT 
                asis.id_asistencia,
                asis.jornada, 
                asis.entrada, 
                ac.nombre AS actividad,
                asis.salida
            FROM asistencias asis 
            JOIN ingresos i ON asis.asistencia_ingreso = i.id_ingreso
            JOIN actividades ac ON asis.asistencia_actividad = ac.id_actividad
            WHERE asis.asistencia_ingreso = ?
        `, [id]);
        if (!result || result.length === 0) return [null, "No se encontraron registros de asistencias"];
        return [result, null];
    } catch (error) {
        console.error("Error al obtener las actividades del ingreso", error);
        return [null, "Error interno del servidor"];
    }
}

export const createAsistenciaService = async ( body ) => {
    try {
        const { rut, jornada, actividad } = body;
        if(!rut) return [null, "El rut del alumno es requerido"];

        let ingreso_vigente;
        
        //Busca los ingresos asociados al rut del alumno
        const [ingresos] = await db.query(`
            SELECT 
                i.id_ingreso,
                a.nombre,
                i.vigente
            FROM alumnos a 
            JOIN ingresos i ON i.ingreso_alumno = a.id_alumno
            WHERE a.rut = ?
        `,[rut]);
        console.log("Ingresos encontrados: ", ingresos);
        if(!ingresos || ingresos.length === 0) return [null, "El alumno no tiene ingresos registrados"];

        //Si existen ingresos, busca si alguno se encuentra vigente
        for (let ingreso of ingresos) {
            if(ingreso.vigente) ingreso_vigente = ingreso;
        }
        console.log("Ingreso vigente: ", ingreso_vigente);
        if(!ingreso_vigente) return [null, "El alumno no cuenta con un ingreso vigente"];

        const [actividad_encontrada] = await db.query("SELECT id_actividad, nombre, actividad_ingreso FROM actividades WHERE nombre = ?", actividad);
        if(!actividad_encontrada || actividad_encontrada.length === 0) return [null, "No se encontró la actividad"];
        if(actividad_encontrada[0].actividad_ingreso !== ingreso_vigente.id_ingreso) return [null, "El registro de ingreso no contiene esta actividad"];

        //const [alumno] = await db.query("SELECT nombre FROM alumnos WHERE id_alumno = ?", ingreso_vigente.ingreso_alumno);

        const { id_ingreso, nombre: nombre_ingreso } = ingreso_vigente;
        const { id_actividad, nombre: nombre_actividad} = actividad_encontrada[0];

        const [result] = await db.query(`
            INSERT INTO asistencias(
                nombre_alumno, 
                jornada,
                nombre_actividad,
                asistencia_ingreso,
                asistencia_actividad
            ) VALUES (?, ?, ?, ?, ?)
        `, [nombre_ingreso, jornada, nombre_actividad, id_ingreso , id_actividad]);
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
    
        let ingreso_vigente;
        const [ingresos] = await db.query(`
            SELECT 
                i.id_ingreso,
                a.nombre,
                i.vigente
            FROM alumnos a 
            JOIN ingresos i ON i.ingreso_alumno = a.id_alumno
            WHERE a.rut = ?
        `,[body.rut]);
        console.log("Ingresos encontrados: ", ingresos);
        if(!ingresos || ingresos.length === 0) return [null, "El alumno no tiene ingresos registrados"];

        for (let ingreso of ingresos) {
            if(ingreso.vigente) ingreso_vigente = ingreso;
        }
        console.log("Ingreso vigente: ", ingreso_vigente);
        if(!ingreso_vigente) return [null, "El alumno no cuenta con un ingreso vigente"];;

        const [actividad_encontrada] = await db.query("SELECT id_actividad, nombre, actividad_ingreso FROM actividades WHERE nombre = ?", body.actividad);
        if(!actividad_encontrada || actividad_encontrada.length === 0) return [null, "No se encontró la actividad"];
        if(actividad_encontrada[0].actividad_ingreso !== ingreso_vigente.id_ingreso) return [null, "El registro de ingreso no contiene esta actividad"];
        //const [alumno] = await db.query("SELECT nombre FROM alumnos WHERE id_alumno = ?", ingreso[0].ingreso_alumno);

        const { id_ingreso, nombre: nombre_ingreso } = ingreso_vigente;
        const { id_actividad, nombre: nombre_actividad} = actividad_encontrada[0];

        const result = await db.query(`
            UPDATE asistencias SET 
                nombre_alumno = ?, 
                jornada = ?, 
                nombre_actividad = ?, 
                asistencia_ingreso = ?, 
                asistencia_actividad = ?
            WHERE id_asistencia = ?`
            , [
                nombre_ingreso, 
                body.jornada, 
                nombre_actividad, 
                id_ingreso, 
                id_actividad,
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