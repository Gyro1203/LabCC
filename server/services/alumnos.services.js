"use strict";
import db from '../config/db.js';

export const getAlumnosService = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM alumnos");
        if(!result || result.length === 0) return [null, "No hay alumnos registrados"];
        // const alumnosData = result.map(({ id_alumno, ...alumno }) => alumno)
        return [result, null];
        // res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};