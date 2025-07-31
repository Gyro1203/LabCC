"use strict";
import db from "../config/db.js";

export const getCarrerasService = async () => {
  try {
    const [result] = await db.query(
      "SELECT id_carrera, carrera, facultad FROM carreras"
    );
    if (!result || result.length === 0)
      return [null, "No hay carreras registradas"];
    return [result, null];
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    return [null, "Error interno del servidor"];
  }
};