import db from '../config/db.js';
import { handleErrorClient, handleErrorServer, handleSuccess } from '../handlers/responseHandlers.js';

export const getActividades = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM actividades");
        // const [result] = await db.query(`
        //     SELECT 
        //         a.Nombre, 
        //         a.Rut, 
        //         i.motivo, 
        //         i.titulo, 
        //         i.profesor_guia, 
        //         i.profesor_asignatura, 
        //         i.semestre 
        //     FROM ingresos i 
        //     JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
        // `);
        if(!result || result.length === 0) handleErrorClient(res, 404, "No se encontraron actividades registradas");
        handleSuccess(res, 200, "Registro de actividades encontrado", result);
    } catch (error) {
        console.error("Error al obtener las actividades", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const getActividad = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM actividades WHERE id_actividad = ?", [req.params.id]);
        // const [result] = await db.query(`
        //     SELECT 
        //         a.Nombre, 
        //         a.Rut, 
        //         i.motivo, 
        //         i.titulo, 
        //         i.profesor_guia, 
        //         i.profesor_asignatura, 
        //         i.semestre 
        //     FROM ingresos i 
        //     JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
        //     WHERE i.id_ingreso = ?
        // `, [req.params.id]);
        if (result.length <= 0) return handleErrorClient(res, 404, "No se encontró la actividad solicitada");
        handleSuccess(res, 200, "Actividad encontrada", result[0]);
    } catch (error) {
        return handleErrorServer(res, 500, error.message);
    }
};


export const createActividad = async (req, res) => {
    try {
        let existeAlumno = false;
        let existeIngreso = false;
        let existeEnsayo = false;
        const { nombre, unidad, cantidad, precio_uf, precio_peso, observaciones, actividad_alumno, actividad_ensayo, actividad_ingreso } = req.body;
        const [alumnos] = await db.query("SELECT id_alumno FROM alumnos");
        const [ingresos] = await db.query("SELECT id_ingreso FROM ingresos");
        const [ensayos] = await db.query("SELECT id_ensayo FROM ensayos");
        for(let alumno of alumnos){
            if(alumno.id_alumno == actividad_alumno){
                existeAlumno = true;
                console.log("Alumnos");
                break;
            }
        }
        for(let ingreso of ingresos){
            if(ingreso.id_ingreso == actividad_ingreso){
                existeIngreso= true;
                console.log("Ingreso");
                break;
            }
        }
        for(let ensayo of ensayos){
            if(ensayo.id_ensayo == actividad_ensayo){
                existeEnsayo = true;
                console.log("Ensayo");
                break;
            }
        }
        if(!existeAlumno){
            return handleErrorClient(res, 404, "No se encontró el alumno");
        }else if(!existeIngreso){
            return handleErrorClient(res, 404, "No se encontró el ingreso");
        }else if(!existeEnsayo){
            return handleErrorClient(res, 404, "La actividad no se encuentra registrara entre los ensayos");
        }else{
            const [result] = await db.query(`
            INSERT INTO actividades (
                nombre,
                unidad,
                cantidad,
                precio_uf,
                precio_peso,
                total_uf,
                total_peso,
                observaciones,
                actividad_alumno,
                actividad_ensayo,
                actividad_ingreso
            )VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ,[nombre, unidad, cantidad, precio_uf, precio_peso, (precio_uf * cantidad), (precio_peso * cantidad), observaciones, actividad_alumno, actividad_ensayo, actividad_ingreso]);
            console.log(result);
            return handleSuccess(res, 201, "Actividad creada exitosamente", { id: result.insertId, nombre, unidad, cantidad, precio_uf, precio_peso, "total_uf": (precio_uf * cantidad), "total_peso": (precio_peso * cantidad), observaciones, actividad_alumno, actividad_ensayo, actividad_ingreso });
        }
    } catch (error) {
        console.error("Error al crear la actividad", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const updateActividad = async (req, res) => {
    try {
        let existeAlumno = false;
        let existeIngreso = false;
        let existeEnsayo = false;
        const [alumnos] = await db.query("SELECT id_alumno FROM alumnos");
        const [ingresos] = await db.query("SELECT id_ingreso FROM ingresos");
        const [ensayos] = await db.query("SELECT id_ensayo FROM ensayos");
        for(let alumno of alumnos){
            if(alumno.id_alumno == req.body.actividad_alumno){
                existeAlumno = true;
                console.log("Alumnos");
                break;
            }
        }
        for(let ingreso of ingresos){
            if(ingreso.id_ingreso == req.body.actividad_ingreso){
                existeIngreso= true;
                console.log("Ingreso");
                break;
            }
        }
        for(let ensayo of ensayos){
            if(ensayo.id_ensayo == req.body.actividad_ensayo){
                existeEnsayo = true;
                console.log("Ensayo");
                break;
            }
        }
        if(!existeAlumno){
            return handleErrorClient(res, 404, "No se encontró el alumno");
        }else if(!existeIngreso){
            return handleErrorClient(res, 404, "No se encontró el ingreso");
        }else if(!existeEnsayo){
            return handleErrorClient(res, 404, "La actividad no se encuentra registrara entre los ensayos");
        }else{
            const [result] = await db.query("UPDATE actividades SET ? WHERE id_actividad = ?", [req.body, req.params.id]);
            console.log(result);
            if (result.affectedRows === 0) return handleErrorClient(res, 404, "No se encontró la actividad solicitada");
            handleSuccess(res, 200, "Actividad actualizada exitosamente", result);
        }
    } catch (error) {
        console.error("Error al modificar la actividad", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const deleteActividad = async (req,res) => {
    try {
        const [result] = await db.query("DELETE FROM actividades WHERE id_actividad = ?", [req.params.id]);
        if (result.affectedRows === 0) return handleErrorClient(res, 404, "No se encontró la actividad solicitada");
        handleSuccess(res, 200, "Actividad eliminada exitosamente");
    } catch (error) {
        console.error("Error al eliminar la actividad", error);
        return handleErrorServer(res, 500, error.message);
    }
};