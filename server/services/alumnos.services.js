"use strict";
import db from "../config/db.js";

export const getAllAlumnosService = async () => {
  try {
    const [result] = await db.query(
      "SELECT id_alumno, nombre, rut, estado, alumno_carrera FROM alumnos"
    );
    if (!result || result.length === 0)
      return [null, "No hay alumnos registrados"];
    return [result, null];
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    return [null, "Error interno del servidor"];
  }
};

export const getAlumnosService = async () => {
  try {
    const [result] = await db.query(
      "SELECT id_alumno, nombre, rut, estado, alumno_carrera FROM alumnos WHERE estado != ?",
      "Eliminado"
    );
    if (!result || result.length === 0)
      return [null, "No hay alumnos registrados"];
    return [result, null];
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    return [null, "Error interno del servidor"];
  }
};

export const getAlumnoService = async (id) => {
  try {
    const [result] = await db.query(
      "SELECT id_alumno, nombre, rut, estado, alumno_carrera FROM alumnos WHERE id_alumno = ? AND estado != ?",
      [id, "Eliminado"]
    );
    if (!result || result.length === 0)
      return [null, "No se encontró al alumno"];
    return [result[0], null];
  } catch (error) {
    console.error("Error al obtener alumno", error);
    return [null, "Error interno del servidor"];
  }
};

export const createAlumnoService = async (body) => {
  try {
    const { nombre, rut, estado, alumno_carrera } = body;
    console.log("Creando alumno:", body);
    const [existeAlumno] = await db.query(
      "SELECT 1 FROM alumnos WHERE rut = ?",
      rut
    );

    if (existeAlumno[0])
      return [null, "Ya existe un alumno con el rut ingresado"];

    const [result] = await db.query(
      "INSERT INTO alumnos (nombre, rut, estado, alumno_carrera) VALUES (?, ?, ?, ?)",
      [nombre, rut, estado, alumno_carrera]
    );
    if (result.affectedRows === 0) return [null, "Error en la creación"];

    const [created] = await db.query(
      "SELECT id_alumno, nombre, rut, estado FROM alumnos WHERE rut = ?",
      rut
    );
    if (!created) return [null, "Alumno no encontrado despues de ser creado"];

    return [created[0], null];
  } catch (error) {
    console.error("Error al crear un alumno", error);
    return [null, "Error interno del servidor"];
  }
};

export const updateAlumnoService = async (body, id) => {
  try {
    const [actualizarAlumno] = await db.query(
      "SELECT rut FROM alumnos WHERE id_alumno = ?",
      id
    );
    if (!actualizarAlumno || actualizarAlumno.length === 0)
      return [null, "No se encontró al alumno"];

    const [existeAlumno] = await db.query(
      "SELECT rut FROM alumnos WHERE rut = ?",
      body.rut
    );

    if (existeAlumno[0] && existeAlumno[0].rut !== actualizarAlumno[0].rut)
      return [null, "Ya existe un alumno con el rut ingresado"];

    if(body.estado && body.estado == "Inactivo") {
      const [result] = await db.query(`
        SELECT 1 FROM ingresos i 
        JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
        WHERE a.id_alumno= ? AND i.vigente = true
        `,
        id
      );

      if (result.length > 0)
        return [null, "No se puede inactivar un alumno con ingresos vigentes"];
    }

    await db.query("UPDATE alumnos SET ? WHERE id_alumno = ?", [body, id]);

    const [alumno] = await db.query(
      "SELECT id_alumno, nombre, rut, estado, alumno_carrera FROM alumnos WHERE id_alumno = ?",
      id
    );
    if (!alumno) return [null, "Alumno no encontrado despues de actualizar"];

    return [alumno[0], null];
  } catch (error) {
    console.error("Error al modificar al alumno", error);
    return [null, "Error interno del servidor"];
  }
};

export const deleteAlumnoService = async (id) => {
  try {
    const [result] = await db.query(
      "SELECT 1 FROM alumnos WHERE id_alumno = ? AND estado != ?",
      [id, "Eliminado"]
    );
    if (!result || result.length === 0)
      return [null, "No se encontró al alumno"];
    // const [deleted] = await db.query("DELETE FROM alumnos WHERE id_alumno = ?", id );
    const [deleted] = await db.query("UPDATE alumnos SET estado = ? WHERE id_alumno = ?", ["Eliminado", id]);
    const [alumno] = await db.query(
      "SELECT id_alumno, nombre, rut, estado, alumno_carrera FROM alumnos WHERE id_alumno = ?",
      id
    );
    if (deleted.affectedRows === 0)
      return [null, "No se pudo borrar al alumno"];
    return [alumno[0], null];
  } catch (error) {
    console.error("Error eliminando al alumnos", error);
    return [null, "Error interno del servidor"];
  }
};
