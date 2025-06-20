"use strict";
import db from '../config/db.js';

export const getIngresosService = async () => {
    try {
        const [result] = await db.query(`
            SELECT 
                i.id_ingreso,
                a.nombre, 
                a.rut, 
                i.motivo, 
                i.titulo, 
                i.profesor_guia, 
                i.profesor_asignatura, 
                i.vigente,
                i.semestre 
            FROM ingresos i 
            JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
        `);
        if(!result || result.length === 0) return [null, "No hay registros de ingresos al laboratorio"];
        return [result, null];
    } catch (error) {
        console.error("Error al obtener los ingresos", error);
        return [null, "Error interno del servidor"];
    }
};

export const getIngresoService = async ( id ) => {
    try {
        const [result] = await db.query(`
            SELECT
                i.id_ingreso,
                i.ingreso_alumno,
                a.nombre, 
                a.rut, 
                i.motivo, 
                i.titulo, 
                i.profesor_guia, 
                i.profesor_asignatura,
                i.vigente,
                i.semestre
            FROM ingresos i 
            JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
            WHERE i.id_ingreso = ?
        `, id);
        if (!result || result.length === 0) return [null, "No se encontró el ensayo"];
        return [result[0], null];
    } catch (error) {
        console.error("Error al obtener el ingreso", error);
        return [null, "Error interno del servidor"];
    }
}

export const createIngresoService = async ( body ) => {
    try {
        const { rut, motivo, titulo, profesor_guia, profesor_asignatura, semestre } = body;

        const [alumno] = await db.query("SELECT id_alumno FROM alumnos WHERE rut = ?", rut);
        if(!alumno || alumno.length === 0) return [null, "No se encontró al alumno"];

        const [existeIngreso] = await db.query("SELECT * FROM ingresos WHERE ingreso_alumno = ? AND vigente = 1", alumno[0].id_alumno);
        if(existeIngreso.length > 0) return [null, "Un alumno no puede tener mas de un ingreso vigente"];
        
        const [existeTitulo] = await db.query("SELECT * FROM ingresos WHERE titulo = ?", titulo);
        if(existeTitulo.length > 0) return [null, "Ya existe un proyecto con ese titulo"];
        
        const [result] = await db.query(`
            INSERT INTO ingresos(
                motivo, 
                titulo, 
                profesor_guia, 
                profesor_asignatura, 
                semestre,
                ingreso_alumno
            )VALUES (?, ?, ?, ?, ?, ?)`
            , [motivo, titulo, profesor_guia, profesor_asignatura, semestre, alumno[0].id_alumno]
        );
        if(result.affectedRows === 0) return [null, "Error en la creación del ingreso"];

        const [created] = await db.query("SELECT * FROM ingresos WHERE id_ingreso = ?", result.insertId);
        if(!created) return [null, "No se encontró el ingreso despues de se creación"];

        return [created[0], null];
    } catch (error) {
        console.error("Error al crear el ingreso", error);
        return [null, "Error interno del servidor"];
    }
}

export const updateIngresoService = async ( body, id ) => {
    try {
        const [actualizarIngreso] = await db.query("SELECT * FROM ingresos WHERE id_ingreso = ?", id);
        if(!actualizarIngreso || actualizarIngreso.length === 0) return [null, "Registro de ingreso no encontrado"];
        
        //const ingreso_alumno = (!body.ingreso_alumno) ? actualizarIngreso[0].ingreso_alumno : body.ingreso_alumno;

        const [alumno] = await db.query("SELECT id_alumno FROM alumnos WHERE rut = ?", body.rut);
        if(!alumno || alumno.length === 0) return [null, "No se encontró al alumno"];
        
        const [esVigente] = await db.query("SELECT * FROM ingresos WHERE ingreso_alumno = ? AND vigente = 1", alumno[0].id_alumno);
        if(esVigente[0] && esVigente[0].id_ingreso !== actualizarIngreso[0].id_ingreso) return [null, "Un alumno no puede tener mas de un ingreso vigente"];

        const titulo  = (!body.titulo) ? actualizarIngreso[0].titulo : body.titulo;
        const [existeTitulo] = await db.query("SELECT * FROM ingresos WHERE titulo = ?", titulo);
        if(existeTitulo[0] && existeTitulo[0].titulo !== actualizarIngreso[0].titulo)
            return [null, "Ya existe un proyecto con ese titulo"];

        await db.query(`
            UPDATE ingresos SET
                motivo = ?, 
                titulo = ?, 
                profesor_guia = ?, 
                profesor_asignatura = ?, 
                semestre = ?,
                ingreso_alumno = ?
            WHERE id_ingreso = ?`
            , [
                body.motivo,
                body.titulo,
                body.profesor_guia,
                body.profesor_asignatura,
                body.semestre,
                alumno[0].id_alumno,
                id
            ]
        );

        const [ingreso] = await db.query("SELECT * FROM ingresos WHERE id_ingreso = ?", id);
        if(!ingreso) return [null, "No se encontró el ingreso despues de actualizar"];

        return [ingreso[0], null];
    } catch (error) {
        console.error("Error al modificar el ingreso", error);
        return [null, "Error interno del servidor"];
    }
}

export const deleteIngresoService = async ( id ) => {
    try {
        const [result] = await db.query("SELECT * FROM ingresos WHERE id_ingreso = ?", id);
        if (!result || result.length === 0) return [null, "Registro de ingreso no encontrado"];
        const [deleted] = await db.query("DELETE FROM ingresos WHERE id_ingreso = ?", id);
        if(deleted.affectedRows === 0) return [null, "No se pudo borrar el ingreso"];
        return [result[0], null];
    } catch (error) {
        console.error("Error eliminando el ingreso", error);
        return [null, "Error interno del servidor"];
    }
}