import { Router } from "express";
import { getAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno } from "../controllers/alumnosController.js";

const router = Router();

router.get("/students", getAlumnos);

router.get("/students/:id", getAlumno);

router.post("/students", createAlumno);

router.put("/students/:id", updateAlumno);

router.delete("/students/:id", deleteAlumno);

export default router;
