import db from '../config/db.js';
import { handleErrorClient, handleErrorServer, handleSuccess } from '../handlers/responseHandlers.js';

export const getEnsayos = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM ensayos");
        if(!result || result.length === 0) handleErrorClient(res, 404, "No se encontraron ensayos registrados");
        handleSuccess(res, 200, "Registro de ensayo encontrado", result);
    } catch (error) {
        console.error("Error al obtener Ensayos", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const getEnsayo = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM ensayos WHERE id_ensayo = ?", [req.params.id]);
        if (result.length <= 0) return handleErrorClient(res, 404, "No se encontró el ensayo");
        handleSuccess(res, 200, "Ensayo encontrado", result[0]);
    } catch (error) {
        console.error("Error al obtener el ensayo", error);
        handleErrorServer(res, 500, error.message);
    }
};


export const createEnsayo = async (req, res) => {
    try {
        let UF = 39174;
        const { nombre, tipo, precio_uf } = req.body;
        const [result] = await db.query("INSERT INTO ensayos (nombre, tipo, precio_uf, precio_peso) VALUES (?, ?, ?, ?)", [nombre, tipo, precio_uf, precio_uf * UF]);
        console.log(result);
        handleSuccess(
            res, 
            201, 
            "Ensayo creado exitosamente", 
            { id: result.insertId, nombre, tipo, precio_uf, precio_peso: precio_uf * UF }
        );
    } catch (error) {
        console.error("Error al crear un ensayo", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const updateEnsayo = async (req, res) => {
    try {
        let UF = 39174;
        const [result] = await db.query("UPDATE ensayos SET ?, precio_peso = ? WHERE id_ensayo = ?", [req.body, req.body.precio_uf * UF, req.params.id]);
        console.log(result);
        if (result.affectedRows === 0) return handleErrorClient(res, 404, "No se encontró el ensayo"); 
        handleSuccess(res, 200, "Ensayo actualizado exitosamente", result);
    } catch (error) {
        console.error("Error al modificar el ensayo", error);
        handleErrorServer(res, 500, error.message);
    }
};

export const deleteEnsayo = async (req,res) => {
    try {
        const [result] = await db.query("DELETE FROM ensayos WHERE id_ensayo = ?", [req.params.id]);
        if (result.affectedRows === 0) return handleErrorClient(res, 404, "No se encontraron ensayos");
        handleSuccess(res, 200, "Se elimino el ensayo correctamente");
    } catch (error) {
        console.error("Error al eliminar el ensayo", error);
        handleErrorServer(res, 500, error.message);
    }
};