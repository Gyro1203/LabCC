"use strict";
import db from "../config/db.js";

export const getEnsayosService = async () => {
  try {
    const [result] = await db.query("SELECT id_ensayo, actividad, area, unidad, precio_uf, precio_peso FROM ensayos");
    if (!result || result.length === 0)
      return [null, "No se encontraron ensayos registrados"];
    return [result, null];
  } catch (error) {
    console.error("Error al obtener ensayos", error);
    return [null, "Error interno del servidor"];
  }
};

export const getEnsayoService = async (id) => {
  try {
    const [result] = await db.query(
      "SELECT id_ensayo, actividad, area, unidad, precio_uf, precio_peso FROM ensayos WHERE id_ensayo = ?",
      id
    );
    if (!result || result.length === 0)
      return [null, "No se encontró el ensayo"];
    return [result[0], null];
  } catch (error) {
    console.error("Error al obtener el ensayo", error);
    return [null, "Error interno del servidor"];
  }
};

export const createEnsayoService = async (body) => {
  try {
    let UF = 39174;
    const { actividad, area, unidad, precio_uf } = body;

    const [existeEnsayo] = await db.query(
      "SELECT 1 FROM ensayos WHERE actividad = ?",
      actividad
    );
    if (existeEnsayo[0])
      return [null, "Ya existe una actividad con ese nombre en los ensayos"];

    const [result] = await db.query(
      `
      INSERT INTO ensayos(
        actividad,
        area,
        unidad,
        precio_uf,
        precio_peso
      ) VALUES (?, ?, ?, ?, ?)`,
      [actividad, area, unidad, precio_uf, precio_uf * UF]
    );
    if (result.affectedRows === 0)
      return [null, "Error en la creación del ensayo"];

    const [created] = await db.query(
      "SELECT id_ensayo, actividad, area, unidad, precio_uf, precio_peso FROM ensayos WHERE id_ensayo = ?",
      result.insertId
    );
    if (!created) return [null, "Ensayo no encontrado despues de ser creado"];

    return [created[0], null];
  } catch (error) {
    console.error("Error al crear un ensayo", error);
    return [null, "Error interno del servidor"];
  }
};

export const updateEnsayoService = async (body, id) => {
  try {
    let UF = 39174;
    const [actualizarEnsayo] = await db.query(
      "SELECT actividad FROM ensayos WHERE id_ensayo = ?",
      id
    );
    if (!actualizarEnsayo || actualizarEnsayo.length === 0)
      return [null, "No se encontró el ensayo"];

    const [existeEnsayo] = await db.query(
      "SELECT actividad FROM ensayos WHERE actividad = ?",
      body.actividad
    );
    if (
      existeEnsayo[0] &&
      existeEnsayo[0].actividad !== actualizarEnsayo[0].actividad
    )
      return [null, "Ya existe una actividad con ese nombre en los ensayos"];

    await db.query(
      "UPDATE ensayos SET ?, precio_peso = ? WHERE id_ensayo = ?",
      [body, body.precio_uf * UF, id]
    );

    const [ensayo] = await db.query(
      "SELECT id_ensayo, actividad, area, unidad, precio_uf, precio_peso FROM ensayos WHERE id_ensayo = ?",
      id
    );
    if (!ensayo) return [null, "Ensayo no encontrado despues de actualizar"];

    return [ensayo[0], null];
  } catch (error) {
    console.error("Error al modificar el ensayo", error);
    return [null, "Error interno del servidor"];
  }
};

export const deleteEnsayoService = async (id) => {
  try {
    const [result] = await db.query(
      "SELECT id_ensayo, actividad, area, unidad, precio_uf, precio_peso FROM ensayos WHERE id_ensayo = ?",
      id
    );
    if (!result || result.length === 0)
      return [null, "No se encontró el ensayo"];
    const [deleted] = await db.query(
      "DELETE FROM ensayos WHERE id_ensayo = ?",
      id
    );
    if (deleted.affectedRows === 0)
      return [null, "No se pudo borrar el ensayo"];
    return [result[0], null];
  } catch (error) {
    console.error("Error eliminando el ensayo", error);
    return [null, "Error interno del servidor"];
  }
};
