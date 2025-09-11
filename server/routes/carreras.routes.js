import { Router } from "express";
import {
  getCarreras,
  getCarreraById,
  createCarrera,
  updateCarrera,
  deleteCarrera,
} from "../controllers/carreras.controller.js";

const router = Router();

router.get("/careers", getCarreras); // Obtener todas las carreras
router.get("/careers/:id", getCarreraById); // Obtener carrera por ID
router.post("/careers", createCarrera); // Crear carrera
router.put("/careers/:id", updateCarrera); // Actualizar carrera
router.delete("/careers/:id", deleteCarrera); // Eliminar carrera

export default router;
