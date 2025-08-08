import { Router } from "express";
import { getIngresos, getIngreso, createIngreso, updateIngreso, deleteIngreso, getIngresoByAlumno } from "../controllers/ingresoController.js";

const router = Router();

router.get("/entry", getIngresos);

router.get("/entry/:id", getIngreso);

router.get("/entry/student/:id", getIngresoByAlumno);

router.post("/entry", createIngreso);

router.put("/entry/:id", updateIngreso);

router.delete("/entry/:id", deleteIngreso);

export default router;
