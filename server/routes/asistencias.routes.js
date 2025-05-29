import { Router } from "express";
import { getAsistencias, getAsistencia, createAsistencia, updateAsistencia, marcarSalida, deleteAsistencia } from "../controllers/asistenciasController.js";

const router = Router();

router.get("/attendance", getAsistencias);

router.get("/attendance/:id", getAsistencia);

router.post("/attendance", createAsistencia);

router.put("/attendance/:id", updateAsistencia);

router.put("/attendance/mark/:id", marcarSalida);

router.delete("/attendance/:id", deleteAsistencia);

export default router;
