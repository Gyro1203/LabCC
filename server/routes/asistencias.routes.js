import { Router } from "express";
import { getAsistencias, getAsistencia, createAsistencia, updateAsistencia, marcarSalida, deleteAsistencia, getAsistenciasByIngreso } from "../controllers/asistenciasController.js";

const router = Router();

router.get("/attendance", getAsistencias);

router.get("/attendance/:id", getAsistencia);

router.get("/attendance/entry/:id", getAsistenciasByIngreso);

router.post("/attendance", createAsistencia);

router.put("/attendance/:id", updateAsistencia);

router.put("/attendance/mark/:id", marcarSalida);

router.delete("/attendance/:id", deleteAsistencia);

export default router;
