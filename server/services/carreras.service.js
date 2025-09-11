"use strict";
import db from "../config/db.js";

export const getCarrerasService = async () => {
  try {
    const [result] = await db.query(
      "SELECT id_carrera, carrera, facultad, departamento FROM carreras"
    );
    if (!result || result.length === 0)
      return [null, "No hay carreras registradas"];
    return [result, null];
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    return [null, "Error interno del servidor"];
  }
};

// Obtener una carrera por ID
export const getCarreraByIdService = async (id) => {
  try {
    const [result] = await db.query(
      "SELECT id_carrera, carrera, facultad, departamento FROM carreras WHERE id_carrera = ?",
      [id]
    );
    if (!result || result.length === 0)
      return [null, "Carrera no encontrada"];
    return [result[0], null];
  } catch (error) {
    console.error("Error al obtener carrera:", error);
    return [null, "Error interno del servidor"];
  }
};

// Crear una nueva carrera
export const createCarreraService = async (carrera, facultad, departamento) => {
  try {
    const [result] = await db.query(
      "INSERT INTO carreras (carrera, facultad, departamento) VALUES (?, ?, ?)",
      [carrera, facultad, departamento]
    );
    return [result.insertId, null];
  } catch (error) {
    console.error("Error al crear carrera:", error);
    return [null, "Error interno del servidor"];
  }
};

// Actualizar una carrera
export const updateCarreraService = async (id, carrera, facultad, departamento) => {
  try {
    const [result] = await db.query(
      "UPDATE carreras SET carrera = ?, facultad = ?, departamento = ? WHERE id_carrera = ?",
      [carrera, facultad, departamento, id]
    );
    if (result.affectedRows === 0)
      return [null, "Carrera no encontrada"];
    return [true, null];
  } catch (error) {
    console.error("Error al actualizar carrera:", error);
    return [null, "Error interno del servidor"];
  }
};

// Eliminar una carrera
export const deleteCarreraService = async (id) => {
  try {
    const [result] = await db.query(
      "DELETE FROM carreras WHERE id_carrera = ?",
      [id]
    );
    if (result.affectedRows === 0)
      return [null, "Carrera no encontrada"];
    return [true, null];
  } catch (error) {
    console.error("Error al eliminar carrera:", error);
    return [null, "Error interno del servidor"];
  }
};