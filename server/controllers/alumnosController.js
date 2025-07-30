"use strict";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import {
  getAlumnosService,
  getAlumnoService,
  createAlumnoService,
  updateAlumnoService,
  deleteAlumnoService,
} from "../services/alumnos.services.js";

export const getAlumnos = async (req, res) => {
  try {
    const [alumnos, errorAlumnos] = await getAlumnosService();
    if (errorAlumnos) return handleErrorClient(res, 404, errorAlumnos);
    alumnos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Registro de alumnos encontrado", alumnos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const getAlumno = async (req, res) => {
  try {
    const [alumno, errorAlumno] = await getAlumnoService([req.params.id]);
    if (errorAlumno) return handleErrorClient(res, 404, errorAlumno);
    handleSuccess(res, 200, "Alumno encontrado", alumno);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const createAlumno = async (req, res) => {
  try {
    const { nombre, rut, estado, alumno_carrera } = req.body;
    const [alumno, errorAlumno] = await createAlumnoService({
      nombre,
      rut,
      estado,
      alumno_carrera,
    });
    if (errorAlumno)
      return handleErrorClient(res, 400, "Error al crear alumno", errorAlumno);
    handleSuccess(res, 201, "Alumno creado exitosamente", alumno);
  } catch (error) {
    console.error("Error al crear un alumno", error);
    handleErrorServer(res, 500, error.message);
  }
};

export const updateAlumno = async (req, res) => {
  try {
    const [alumno, errorAlumno] = await updateAlumnoService(
      req.body,
      req.params.id
    );
    if (errorAlumno) return handleErrorClient(res, 404, errorAlumno);
    handleSuccess(res, 200, "Datos del alumno actualizados", alumno);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const deleteAlumno = async (req, res) => {
  try {
    const [alumno, errorAlumno] = await deleteAlumnoService(req.params.id);
    if (errorAlumno)
      return handleErrorClient(
        res,
        404,
        "Error elimando al alumno",
        errorAlumno
      );
    handleSuccess(
      res,
      200,
      "Se elimino el registro del alumno exitosamente",
      alumno
    );
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};
