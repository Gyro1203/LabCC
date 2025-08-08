"use strict";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import {
  getIngresosService,
  getIngresoService,
  createIngresoService,
  updateIngresoService,
  deleteIngresoService,
  getIngresoByAlumnoService,
} from "../services/ingresos.services.js";

export const getIngresos = async (req, res) => {
  try {
    const [ingresos, errorIngresos] = await getIngresosService();
    if (errorIngresos) return handleErrorClient(res, 404, errorIngresos);
    handleSuccess(res, 200, "Registro de ingresos encontrado", ingresos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const getIngreso = async (req, res) => {
  try {
    const [ingreso, errorIngreso] = await getIngresoService(req.params.id);
    if (errorIngreso) return handleErrorClient(res, 404, errorIngreso);
    handleSuccess(res, 200, "Ingreso encontrado", ingreso);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const getIngresoByAlumno = async (req, res) => {
  try {
    const [ingreso, errorIngreso] = await getIngresoByAlumnoService(
      req.params.id
    );
    if (errorIngreso) return handleErrorClient(res, 404, errorIngreso);
    handleSuccess(res, 200, "Registro de ingresos encontrado", ingreso);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const createIngreso = async (req, res) => {
  try {
    const {
      rut,
      motivo,
      titulo,
      vigente,
      profesor_guia,
      profesor_asignatura,
      semestre,
    } = req.body;
    const [ingreso, errorIngreso] = await createIngresoService({
      rut,
      motivo,
      titulo,
      vigente,
      profesor_guia,
      profesor_asignatura,
      semestre,
    });
    if (errorIngreso) return handleErrorClient(res, 400, errorIngreso);
    return handleSuccess(res, 201, "Ingreso registrado exitosamente", ingreso);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const updateIngreso = async (req, res) => {
  try {
    const [ingreso, errorIngreso] = await updateIngresoService(
      req.body,
      req.params.id
    );
    if (errorIngreso) return handleErrorClient(res, 400, errorIngreso);
    handleSuccess(res, 200, "Ingreso modificado exitosamente", ingreso);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

export const deleteIngreso = async (req, res) => {
  try {
    const [ingreso, errorIngreso] = await deleteIngresoService(req.params.id);
    if (errorIngreso) return handleErrorClient(res, 404, errorIngreso);
    handleSuccess(res, 200, "Ingreso eliminado exitosamente", ingreso);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};
