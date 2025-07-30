"use strict";
import db from "../config/db.js";

export const getAsistenciasService = async () => {
  try {
    const [result] = await db.query(`
      SELECT 
        asis.id_asistencia,
        al.nombre AS alumno, 
        DATE_FORMAT(asis.fecha, '%d/%m/%Y') AS fecha, 
        asis.jornada, 
        asis.entrada, 
        asis.salida,
        asis.actividad
      FROM asistencias asis 
      JOIN ingresos i ON asis.asistencia_ingreso = i.id_ingreso
      JOIN alumnos al ON i.ingreso_alumno = al.id_alumno
    `);
    if (!result || result.length === 0)
      return [null, "No se encontraron registros de asistencias"];
    return [result, null];
  } catch (error) {
    console.error("Error al obtener las asistencias", error);
    return [null, "Error interno del servidor"];
  }
};

export const getAsistenciaService = async (id) => {
  try {
    const [result] = await db.query(
      `SELECT 
        asis.id_asistencia,
        al.nombre AS alumno,
        al.rut,
        DATE_FORMAT(asis.fecha, '%d/%m/%Y') AS fecha, 
        asis.jornada, 
        asis.entrada, 
        asis.salida,
        asis.actividad,
        asis.asistencia_ingreso
      FROM asistencias asis 
      JOIN ingresos i ON asis.asistencia_ingreso = i.id_ingreso
      JOIN alumnos al ON i.ingreso_alumno = al.id_alumno
      WHERE asis.id_asistencia = ?`,
      [id]
    );
    if (!result || result.length === 0)
      return [null, "Registro de asistencias no encontrado"];
    return [result[0], null];
  } catch (error) {
    console.error("Error al obtener la asistencia", error);
    return [null, "Error interno del servidor"];
  }
};

export const getAsistenciasByIngresoService = async (id) => {
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
        id_asistencia,
        DATE_FORMAT(fecha, '%d/%m/%Y') AS fecha, 
        jornada, 
        entrada, 
        salida,
        actividad
      FROM asistencias
      WHERE asistencia_ingreso = ?`,
      [id]
    );
    if (!result || result.length === 0)
      return [null, "No se encontraron registros de asistencias"];
    return [result, null];
  } catch (error) {
    console.error("Error al obtener las actividades del ingreso", error);
    return [null, "Error interno del servidor"];
  }
};

export const createAsistenciaService = async (body) => {
  try {
    const { rut, actividad } = body;
    if (!rut) return [null, "El rut del alumno es requerido"];

    let ingreso_vigente;

    //Busca los ingresos asociados al rut del alumno
    const [ingresos] = await db.query(
      `SELECT 
        i.id_ingreso,
        a.nombre,
        i.vigente
      FROM alumnos a 
      JOIN ingresos i ON i.ingreso_alumno = a.id_alumno
      WHERE a.rut = ?`,
      [rut]
    );

    if (!ingresos || ingresos.length === 0)
      return [null, "El alumno no tiene ingresos registrados"];

    //Si existen ingresos, busca si alguno se encuentra vigente
    for (let ingreso of ingresos) {
      if (ingreso.vigente) ingreso_vigente = ingreso;
    }

    if (!ingreso_vigente)
      return [null, "El alumno no cuenta con un ingreso vigente"];

    const now = new Date();
    const fecha = now.toISOString().split("T")[0];
    const entrada = now.toTimeString().split(" ")[0];
    const jornada = now.getHours() < 12 ? "Mañana" : "Tarde";

    const [result] = await db.query(
      `INSERT INTO asistencias(
        fecha,
        entrada,
        jornada,
        actividad,
        asistencia_ingreso
      ) VALUES (?, ?, ?, ?, ?)`,
      [fecha, entrada, jornada, actividad, ingreso_vigente.id_ingreso]
    );
    if (result.affectedRows === 0)
      return [null, "Error al registrar la asistencia"];

    const [created] = await db.query(
      `SELECT 
        asis.id_asistencia,
        al.nombre AS alumno, 
        DATE_FORMAT(fecha, '%d/%m/%Y') AS fecha, 
        asis.jornada, 
        asis.entrada, 
        asis.actividad,
        asis.salida
      FROM asistencias asis 
      JOIN ingresos i ON asis.asistencia_ingreso = i.id_ingreso
      JOIN alumnos al ON i.ingreso_alumno = al.id_alumno
      WHERE id_asistencia = ?`,
      result.insertId
    );
    if (!created)
      return [
        null,
        "No se encontró el registro de asistencia despues de su creación",
      ];

    return [created[0], null];
  } catch (error) {
    console.error("Error al crear la asistencia", error);
    return [null, "Error interno del servidor"];
  }
};

export const updateAsistenciaService = async (body, id) => {
  try {
    const [actualizarAsistencia] = await db.query(
      "SELECT fecha, entrada, jornada, actividad FROM asistencias WHERE id_asistencia = ?",
      id
    );
    if (!actualizarAsistencia || actualizarAsistencia.length === 0)
      return [null, "Registro de asistencia no encontrado"];

    let ingreso_vigente, jornada;
    const [ingresos] = await db.query(
      `SELECT 
        i.id_ingreso,
        a.nombre,
        i.vigente
      FROM alumnos a 
      JOIN ingresos i ON i.ingreso_alumno = a.id_alumno
      WHERE a.rut = ?`,
      [body.rut]
    );
    
    if (!ingresos || ingresos.length === 0)
      return [null, "El alumno no tiene ingresos registrados"];

    for (let ingreso of ingresos) {
      if (ingreso.vigente) ingreso_vigente = ingreso;
    }
    
    if (!ingreso_vigente)
      return [null, "El alumno no cuenta con un ingreso vigente"];
    //const [alumno] = await db.query("SELECT nombre FROM alumnos WHERE id_alumno = ?", ingreso[0].ingreso_alumno);

    if (body.entrada) {
      const hora = parseInt(body.entrada.split(":")[0], 10); // 10 -> base decimal
      jornada = hora < 12 ? "Mañana" : "Tarde";
    }

    const result = await db.query(
      `UPDATE asistencias SET 
        fecha = ?, 
        entrada = ?,
        jornada = ?,
        salida = ?,  
        actividad = ?, 
        asistencia_ingreso = ?
      WHERE id_asistencia = ?`,
      [
        body.fecha || actualizarAsistencia[0].fecha,
        body.entrada || actualizarAsistencia[0].entrada,
        jornada || actualizarAsistencia[0].jornada,
        body.salida || actualizarAsistencia[0].salida,
        body.actividad || actualizarAsistencia[0].actividad,
        ingreso_vigente.id_ingreso,
        id,
      ]
    );
    if (result.affectedRows === 0)
      return [null, "Error al actualizar la asistencia"];

    const [asistencia] = await db.query(
      `SELECT 
        asis.id_asistencia,
        al.nombre AS alumno, 
        DATE_FORMAT(fecha, '%d/%m/%Y') AS fecha,
        asis.jornada, 
        asis.entrada, 
        asis.actividad,
        asis.salida
      FROM asistencias asis 
      JOIN ingresos i ON asis.asistencia_ingreso = i.id_ingreso
      JOIN alumnos al ON i.ingreso_alumno = al.id_alumno
      WHERE id_asistencia = ?`,
      id
    );
    if (!asistencia)
      return [
        null,
        "No se encontró el registro de asistencia despues de actualizar",
      ];

    return [asistencia[0], null];
  } catch (error) {
    console.error("Error al modificar la asistencia", error);
    return [null, "Error interno del servidor"];
  }
};

export const marcarSalidaService = async (id) => {
  try {
    const now = new Date();
    const salida = now.toTimeString().split(" ")[0];

    const [result] = await db.query(
      "UPDATE asistencias SET salida = ? WHERE id_asistencia = ?",
      [salida, id]
    );
    if (result.affectedRows === 0)
      return [
        null,
        "No se encontró el registro de asistencia o ya se marcó la salida",
      ];
    const [asistencia] = await db.query(
      `SELECT 
        asis.id_asistencia,
        al.nombre AS alumno, 
        DATE_FORMAT(asis.fecha, '%d/%m/%Y') AS fecha, 
        asis.jornada, 
        asis.entrada, 
        asis.salida,
        asis.actividad
      FROM asistencias asis 
      JOIN ingresos i ON asis.asistencia_ingreso = i.id_ingreso
      JOIN alumnos al ON i.ingreso_alumno = al.id_alumno
      WHERE asis.id_asistencia = ?`,
      [id]
    );
    if (!asistencia || asistencia.length === 0)
      return [
        null,
        "No se encontró el registro de asistencia despues de marcar la salida",
      ];
    return [asistencia[0], null];
  } catch (error) {
    console.error("Error al marcar salida", error);
    return [null, "Error interno del servidor"];
  }
};

export const deleteAsistenciaService = async (id) => {
  try {
    const [result] = await db.query(
      `SELECT 
        asis.id_asistencia,
        al.nombre AS alumno, 
        DATE_FORMAT(asis.fecha, '%d/%m/%Y') AS fecha, 
        asis.jornada, 
        asis.entrada, 
        asis.salida,
        asis.actividad
      FROM asistencias asis 
      JOIN ingresos i ON asis.asistencia_ingreso = i.id_ingreso
      JOIN alumnos al ON i.ingreso_alumno = al.id_alumno
      WHERE asis.id_asistencia = ?`,
      [id]
    );
    if (!result || result.length === 0)
      return [null, "Registro de asistencia no encontrado"];
    const [deleted] = await db.query(
      "DELETE FROM asistencias WHERE id_asistencia = ?",
      id
    );
    if (deleted.affectedRows === 0)
      return [null, "No se pudo borrar la asistencia"];
    return [result[0], null];
  } catch (error) {
    console.error("Error al eliminar la asistencia", error);
    return [null, "Error interno del servidor"];
  }
};
