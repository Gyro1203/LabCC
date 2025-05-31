import db from '../config/db.js';
import { handleErrorServer, handleSuccess } from '../handlers/responseHandlers.js';

export const getIngresos = async (req, res) => {
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
                i.semestre 
            FROM ingresos i 
            JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
        `);
        if(!result || result.length === 0) handleErrorClient(res, 404, "No se encontraron ingresos");
        handleSuccess(res, 200, "Registro de ingresos encontrado", result);
    } catch (error) {
        console.error("Error al obtener los ingresos", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const getIngreso = async (req, res) => {
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
                i.semestre
            FROM ingresos i 
            JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
            WHERE i.id_ingreso = ?
        `, [req.params.id]);
        if (result.length <= 0) return handleErrorClient(res, 404, "No se encontró el ingreso solicitado");
        handleSuccess(res, 200, "Ingreso encontrado", result[0]);
    } catch (error) {
        console.error("Error al obtener el ingreso", error);
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
        let existe = false;
        const { motivo, titulo, profesor_guia, profesor_asignatura, semestre, ingreso_alumno } = req.body;
        const [estudiantes] = await db.query("SELECT id_alumno FROM alumnos");
        for(let estudiante of estudiantes){
            if(estudiante.id_alumno == ingreso_alumno){
                existe = true;
                break;
            }
        }
        if(existe){
            const [result] = await db.query("INSERT INTO ingresos (motivo, titulo, profesor_guia, profesor_asignatura, semestre, ingreso_alumno) VALUES (?, ?, ?, ?, ?, ?)", [motivo, titulo, profesor_guia, profesor_asignatura, semestre, ingreso_alumno]);
            console.log(result);
            return handleSuccess(
                res,
                201,
                "Ingreso registrado exitosamente",
                { id: result.insertId, motivo, titulo, profesor_guia, profesor_asignatura, semestre, ingreso_alumno }
            );
        }else{
            return handleErrorClient(res, 404, "No se encontró al alumno");
        }
    } catch (error) {
        console.error("Error al crear un ingreso", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const updateIngreso = async (req, res) => {
    try {
        let existe = false;
        const [estudiantes] = await db.query("SELECT id_alumno FROM alumnos");
        for(let estudiante of estudiantes){
            if(estudiante.id_alumno == req.body.ingreso_alumno){
                existe = true;
                break;
            }
        }
        if(existe){
            const [result] = await db.query("UPDATE ingresos SET ? WHERE id_ingreso = ?", [req.body, req.params.id]);
            console.log(result);
            if (result.affectedRows === 0) return handleErrorClient(res, 404, "No se encontró el ingreso solicitado");
            handleSuccess(res, 200, "Ingreso modificado exitosamente", result);
        }else{
            return handleErrorClient(res, 404, "No se encontró al alumno");
        }
    } catch (error) {
        console.error("Error al modificar el ingreso", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const deleteIngreso = async (req,res) => {
    try {
        const [result] = await db.query("DELETE FROM ingresos WHERE id_ingreso = ?", [req.params.id]);
        if (result.affectedRows === 0) return handleErrorClient(res, 404, "No se encontró el ingreso solicitado");
        handleSuccess(res, 200, "Ingreso eliminado exitosamente");
    } catch (error) {
        console.error("Error al eliminar el ingreso", error);
        handleErrorServer(res, 500, error.message);
    }
};