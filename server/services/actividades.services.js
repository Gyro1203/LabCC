"use strict";
import db from "../config/db.js";

export const getActividadesService = async () => {
  try {
    const [result] = await db.query(`
      SELECT 
        ac.id_actividad,
        al.id_alumno,
        al.nombre AS alumno,
        i.semestre AS periodo,
        e.actividad,
        e.unidad, 
        ac.cantidad, 
        e.precio_uf, 
        e.precio_peso, 
        ac.total_uf, 
        ac.total_peso, 
        ac.observaciones
      FROM actividades ac
      JOIN ensayos e ON ac.actividad_ensayo = e.id_ensayo
      JOIN ingresos i ON ac.actividad_ingreso = i.id_ingreso
      JOIN alumnos al ON al.id_alumno = i.ingreso_alumno
    `);
    if (!result || result.length === 0)
      return [null, "No se encontraron actividades registradas"];
    return [result, null];
  } catch (error) {
    console.error("Error al obtener las actividades", error);
    return [null, "Error interno del servidor"];
  }
};

export const getActividadService = async (id) => {
  try {
    const [result] = await db.query(
      `
      SELECT 
        ac.id_actividad,
        al.nombre AS alumno,
        e.actividad,
        e.unidad, 
        ac.cantidad, 
        e.precio_uf, 
        e.precio_peso, 
        ac.total_uf, 
        ac.total_peso, 
        ac.observaciones
      FROM actividades ac
      JOIN ensayos e ON ac.actividad_ensayo = e.id_ensayo
      JOIN ingresos i ON ac.actividad_ingreso = i.id_ingreso
      JOIN alumnos al ON al.id_alumno = i.ingreso_alumno
      WHERE id_actividad = ?`,
      id
    );
    if (!result || result.length === 0)
      return [null, "No se encontró la actividad"];
    return [result[0], null];
  } catch (error) {
    console.error("Error al obtener las actividades", error);
    return [null, "Error interno del servidor"];
  }
};

export const getActividadesByIngresoService = async (id) => {
  try {
    const [ingreso] = await db.query(
      "SELECT id_ingreso FROM ingresos WHERE id_ingreso = ?",
      id
    );
    if (!ingreso || ingreso.length === 0)
      return [null, "No se encontró el ingreso"];

    const [result] = await db.query(
      `
      SELECT 
        ac.id_actividad,
        e.actividad,
        e.unidad, 
        ac.cantidad, 
        e.precio_uf, 
        e.precio_peso, 
        ac.total_uf, 
        ac.total_peso, 
        ac.observaciones
      FROM actividades ac
      JOIN ensayos e ON ac.actividad_ensayo = e.id_ensayo
      JOIN ingresos i ON ac.actividad_ingreso = i.id_ingreso
      JOIN alumnos al ON al.id_alumno = i.ingreso_alumno
      WHERE ac.actividad_ingreso = ?`,
      [id]
    );
    if (!result || result.length === 0)
      return [null, "No se encontraron actividades "];
    return [result, null];
  } catch (error) {
    console.error("Error al obtener las actividades del ingreso", error);
    return [null, "Error interno del servidor"];
  }
};

export const createActividadService = async (body) => {
  try {
    const { cantidad, observaciones, actividad_ensayo, actividad_ingreso } =
      body;
    if (cantidad <= 0) return [null, "La cantidad debe ser mayor a 0"];

    const [ingreso] = await db.query(
      "SELECT vigente FROM ingresos WHERE id_ingreso = ?",
      actividad_ingreso
    );
    if (!ingreso || ingreso.length === 0)
      return [null, "No se encontró el ingreso"];
    if (!ingreso[0].vigente)
      return [null, "El ingreso no se encuentra vigente"];

    const [ensayo] = await db.query(
      "SELECT actividad, unidad, precio_uf, precio_peso FROM ensayos WHERE id_ensayo = ?",
      actividad_ensayo
    );
    if (!ensayo || ensayo.length === 0)
      return [null, "No se encontró el ensayo"];

    const [existe] = await db.query(
      "SELECT id_actividad FROM actividades WHERE actividad_ingreso = ? AND actividad_ensayo = ?",
      [actividad_ingreso, actividad_ensayo]
    );
    if (existe.length > 0) return [null, "No se puede repetir la actividad"];

    const { precio_uf, precio_peso } = ensayo[0];

    const [result] = await db.query(
      `
      INSERT INTO actividades(
        cantidad,
        total_uf,
        total_peso,
        observaciones,
        actividad_ensayo,
        actividad_ingreso
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        cantidad,
        precio_uf * cantidad,
        precio_peso * cantidad,
        observaciones,
        actividad_ensayo,
        actividad_ingreso,
      ]
    );
    if (result.affectedRows === 0)
      return [null, "Error al registrar la actividad"];

    const [created] = await db.query(
      `
      SELECT 
        ac.id_actividad,
        al.nombre AS alumno,
        e.actividad,
        e.unidad, 
        ac.cantidad, 
        e.precio_uf, 
        e.precio_peso, 
        ac.total_uf, 
        ac.total_peso, 
        ac.observaciones
      FROM actividades ac
      JOIN ensayos e ON ac.actividad_ensayo = e.id_ensayo
      JOIN ingresos i ON ac.actividad_ingreso = i.id_ingreso
      JOIN alumnos al ON al.id_alumno = i.ingreso_alumno
      WHERE id_actividad = ?
      `,
      result.insertId
    );
    if (!created)
      return [null, "No se encontró la actividad despues de su creación"];

    return [created[0], null];
  } catch (error) {
    console.error("Error al crear la actividad", error);
    return [null, "Error interno del servidor"];
  }
};

export const updateActividadService = async (body, id) => {
  try {
    if (body.cantidad <= 0) return [null, "La cantidad debe ser mayor a 0"];

    const [actualizarActividad] = await db.query(
      "SELECT id_actividad FROM actividades WHERE id_actividad = ?",
      id
    );
    if (!actualizarActividad || actualizarActividad.length === 0)
      return [null, "Registro de actividad no encontrado"];

    const [ingreso] = await db.query(
      "SELECT vigente FROM ingresos WHERE id_ingreso = ?",
      body.actividad_ingreso
    );
    if (!ingreso || ingreso.length === 0)
      return [null, "No se encontró el ingreso"];
    if (!ingreso[0].vigente)
      return [null, "El ingreso no se encuentra vigente"];

    const [ensayo] = await db.query(
      "SELECT id_ensayo, actividad, unidad, precio_uf, precio_peso FROM ensayos WHERE id_ensayo = ?",
      body.actividad_ensayo,
    );
    if (!ensayo || ensayo.length === 0)
      return [null, "No se encontró el ensayo"];

    const [existe] = await db.query(
      "SELECT id_actividad FROM actividades WHERE actividad_ingreso = ? AND actividad_ensayo = ?",
      [body.actividad_ingreso, body.actividad_ensayo]
    );
    if (existe[0] && existe[0].id_actividad !== actualizarActividad[0].id_actividad)
      return [null, "No se puede repetir la actividad"];

    const { id_ensayo, precio_uf, precio_peso } = ensayo[0];

    await db.query(
      `
      UPDATE actividades SET 
        cantidad = ?, 
        total_uf = ?, 
        total_peso = ?, 
        observaciones = ?, 
        actividad_ensayo = ?, 
        actividad_ingreso = ?
      WHERE id_actividad = ?`,
      [
        body.cantidad,
        precio_uf * body.cantidad,
        precio_peso * body.cantidad,
        body.observaciones,
        id_ensayo,
        body.actividad_ingreso,
        id,
      ]
    );
    //await db.query("UPDATE actividades SET ? WHERE id_actividad = ?", [body, id]);
    //Faltan validaciones por si falta un parametro en body
    const [updated] = await db.query(
      `
      SELECT 
        ac.id_actividad,
        al.nombre AS alumno,
        e.actividad,
        e.unidad, 
        ac.cantidad, 
        e.precio_uf, 
        e.precio_peso, 
        ac.total_uf, 
        ac.total_peso, 
        ac.observaciones
      FROM actividades ac
      JOIN ensayos e ON ac.actividad_ensayo = e.id_ensayo
      JOIN ingresos i ON ac.actividad_ingreso = i.id_ingreso
      JOIN alumnos al ON al.id_alumno = i.ingreso_alumno
      WHERE id_actividad = ?
      `,
      id
    );
    if (!updated)
      return [null, "No se encontró la actividad despues de actualizar"];

    return [updated[0], null];
  } catch (error) {
    console.error("Error al modificar la actividad", error);
    return [null, "Error interno del servidor"];
  }
};

export const deleteActividadService = async (id) => {
  try {
    const [result] = await db.query(
      `
      SELECT 
        ac.id_actividad,
        al.nombre AS alumno,
        e.actividad,
        e.unidad, 
        ac.cantidad, 
        e.precio_uf, 
        e.precio_peso, 
        ac.total_uf, 
        ac.total_peso, 
        ac.observaciones
      FROM actividades ac
      JOIN ensayos e ON ac.actividad_ensayo = e.id_ensayo
      JOIN ingresos i ON ac.actividad_ingreso = i.id_ingreso
      JOIN alumnos al ON al.id_alumno = i.ingreso_alumno
      WHERE id_actividad = ?`,
      id
    );
    if (!result || result.length === 0)
      return [null, "Registro de actividad no encontrado"];
    const [deleted] = await db.query(
      "DELETE FROM actividades WHERE id_actividad = ?",
      id
    );
    if (deleted.affectedRows === 0)
      return [null, "No se pudo borrar la actividad"];
    return [result[0], null];
  } catch (error) {
    console.error("Error al eliminar la actividad", error);
    return [null, "Error interno del servidor"];
  }
};
