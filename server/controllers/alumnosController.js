"use strict";
import db from '../config/db.js';
import { getAlumnosService } from '../services/alumnos.services.js';

export const getAlumnos = async (req, res) => {
    try {
        const [alumnos, errorAlumnos] = await getAlumnosService();
        if(errorAlumnos) res.status(400).json({ status: "Client error", errorAlumnos });
        alumnos.length === 0 
            ? res.status(204).json({ status: "Success" })
            : res.status(200).json({ status: "Success", message: "Alumnos Encontrados", alumnos });
        // const [result] = await db.query("SELECT * FROM alumnos");
        // res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAlumno = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM alumnos WHERE id_alumno = ?", [req.params.id]);
        if (result.length <= 0) return res.status(404).json({ message: "Alumno no encontrado" });
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const createAlumno = async (req, res) => {
    try {
        const { nombre, rut, carrera, facultad, departamento } = req.body;
        const [result] = await db.query("INSERT INTO alumnos (nombre, rut, carrera, facultad, departamento) VALUES (?, ?, ?, ?, ?)", [nombre, rut, carrera, facultad, departamento]);
        console.log(result);
        res.status(201).json({ id: result.insertId, nombre, rut, carrera, facultad, departamento });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateAlumno = async (req, res) => {
    try {
        const [result] = await db.query("UPDATE alumnos SET ? WHERE id_alumno = ?", [req.body, req.params.id]);
        console.log(result);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Alumno no encontrado" });
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteAlumno = async (req,res) => {
    try {
        const [result] = await db.query("DELETE FROM alumnos WHERE id_alumno = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Alumno no encontrado" });
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};