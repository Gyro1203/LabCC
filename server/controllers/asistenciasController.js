import db from "../config/db.js";

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
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    if (result.length <= 0)
      return res.status(404).json({ message: "Asistencias no registrada" });
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "El alumno no existe" });
    } else if (!existeActividad) {
      return res.status(404).json({ message: "La actividad no existe" });
    } else {
      const [result] = await db.query(
        "INSERT INTO asistencias (jornada, asistencia_alumno, asistencia_actividad) VALUES (?, ?, ?)",
        [jornada, asistencia_alumno, asistencia_actividad]
      );
      console.log(result);
      res
        .status(201)
        .json({
          id: result.insertId,
          jornada,
          asistencia_alumno,
          asistencia_actividad,
        });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "El alumno no existe" });
    } else if (!existeActividad) {
      return res.status(404).json({ message: "La actividad no existe" });
    } else {
      const [result] = await db.query(
        "UPDATE asistencias SET ? WHERE id_asistencia = ?",
        [req.body, req.params.id]
      );
      console.log(result);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Asistencias no encontrada" });

      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const marcarSalida = async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE asistencias SET salida = CURRENT_TIMESTAMP WHERE id_asistencia = ?",
      [req.params.id]
    );
    console.log(result);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Asistencias no encontrada" });

    console.log("Salida Marcada");
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAsistencia = async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM asistencias WHERE id_asistencia = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Asistencias no encontrado" });
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
