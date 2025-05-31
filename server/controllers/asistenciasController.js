import db from "../config/db.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export const getAsistencias = async (req, res) => {
  try {
    const [result] = await db.query(`
            SELECT 
                asis.id_asistencia,
                al.nombre AS alumno, 
                asis.jornada, 
                asis.entrada, 
                asis.salida,
                ac.nombre AS actividad
            FROM asistencias asis 
            JOIN alumnos al ON asis.asistencia_alumno = al.id_alumno
            JOIN actividades ac ON asis.asistencia_actividad = ac.id_actividad;
        `);
    if(!result || result.length === 0) handleErrorClient(res, 404, "No se encontraron ingresos");
    handleSuccess(res, 200, "Registro de asistencias encontrado", result);
  } catch (error) {
    console.error("Error al obtener las asistencias", error);
    handleErrorServer(res, 500, error.message);
  }
};

export const getAsistencia = async (req, res) => {
  try {
    // const [result] = await db.query("SELECT * from asistencias WHERE id_asistencia = ?", [req.params.id]) ;
    const [result] = await db.query(
      `
            SELECT 
                asis.id_asistencia,
                al.nombre AS alumno, 
                asis.jornada, 
                asis.entrada, 
                asis.salida,
                ac.nombre AS actividad,
                asis.asistencia_alumno,
                asis.asistencia_actividad
            FROM asistencias asis 
            JOIN alumnos al ON asis.asistencia_alumno = al.id_alumno
            JOIN actividades ac ON asis.asistencia_actividad = ac.id_actividad
            WHERE asis.id_asistencia = ?
        `,
      [req.params.id]
    );
    if (result.length <= 0) return handleErrorClient(res, 404, "No se encontró la asistencia");
    handleSuccess(res, 200, "Asistencia encontrada", result[0]);
  } catch (error) {
    console.error("Error al obtener la asistencia", error);
    handleErrorServer(res, 500, error.message);
  }
};

export const createAsistencia = async (req, res) => {
  try {
    let existeAlumno = false;
    let existeActividad = false;
    const { jornada, asistencia_alumno, asistencia_actividad } = req.body;
    const [alumnos] = await db.query("SELECT id_alumno FROM alumnos");
    const [actividades] = await db.query(
      "SELECT id_actividad FROM actividades"
    );
    for (let alumno of alumnos) {
      if (alumno.id_alumno == asistencia_alumno) {
        existeAlumno = true;
        break;
      }
    }
    for (let actividad of actividades) {
      if (actividad.id_actividad == asistencia_actividad) {
        existeActividad = true;
        break;
      }
    }
    if (!existeAlumno) {
      return handleErrorClient(res, 404, "No se encontró al alumno");
    } else if (!existeActividad) {
      return handleErrorClient(res, 404, "No se encontró la actividad");
    } else {
      const [result] = await db.query(
        "INSERT INTO asistencias (jornada, asistencia_alumno, asistencia_actividad) VALUES (?, ?, ?)",
        [jornada, asistencia_alumno, asistencia_actividad]
      );
      console.log(result);
      handleSuccess(
        res,
        201,
        "Asistencia creada exitosamente",
        {
          id: result.insertId,
          jornada,
          asistencia_alumno,
          asistencia_actividad,
        }
      );
    }
  } catch (error) {
    console.error("Error al crear la asistencia", error);
    handleErrorServer(res, 500, error.message);
  }
};

export const updateAsistencia = async (req, res) => {
  try {
    let existeAlumno = false;
    let existeActividad = false;
    const [alumnos] = await db.query("SELECT id_alumno FROM alumnos");
    const [actividades] = await db.query(
      "SELECT id_actividad FROM actividades"
    );
    for (let alumno of alumnos) {
      if (alumno.id_alumno == req.body.asistencia_alumno) {
        existeAlumno = true;
        break;
      }
    }
    for (let actividad of actividades) {
      if (actividad.id_actividad == req.body.asistencia_actividad) {
        existeActividad = true;
        break;
      }
    }
    if (!existeAlumno) {
      return handleErrorClient(res, 404, "No se encontró al alumno");
    } else if (!existeActividad) {
      return handleErrorClient(res, 404, "No se encontró la actividad");
    } else {
      const [result] = await db.query(
        "UPDATE asistencias SET ? WHERE id_asistencia = ?",
        [req.body, req.params.id]
      );
      console.log(result);
      if (result.affectedRows === 0) return handleErrorClient(res, 404, "Asistencia no encontrada");

      handleSuccess(res, 200, "Asistencia actualizada", result);
    }
  } catch (error) {
    console.error("Error al actualizar la asistencia", error);
    handleErrorServer(res, 500, error.message);
  }
};

export const marcarSalida = async (req, res) => {
  //Probar PATCH en lugar de PUT
  try {
    const [result] = await db.query(
      "UPDATE asistencias SET salida = CURRENT_TIMESTAMP WHERE id_asistencia = ?",
      [req.params.id]
    );
    console.log(result);
    if (result.affectedRows === 0) return handleErrorClient(res, 404, "No se encontró la asistencia");
    handleSuccess(res, 200, "Salida marcada", result);
  } catch (error) {
    console.error("Error al marcar salida", error);
    handleErrorServer(res, 500, error.message);
  }
};

export const deleteAsistencia = async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM asistencias WHERE id_asistencia = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) return handleErrorClient(res, 404, "No se encontró la asistencia");
    handleSuccess(res, 200, "Asistencia eliminada");
  } catch (error) {
    console.error("Error al eliminar la asistencia", error);
    handleErrorServer(res, 500, error.message);
  }
};
