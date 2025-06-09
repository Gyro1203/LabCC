import { Router } from "express";
import { getActividades, getActividad, getActividadByIngreso, createActividad, updateActividad, deleteActividad } from "../controllers/actividadesController.js";

const router = Router();

router.get("/activity", getActividades);

router.get("/activity/:id", getActividad);

router.get("/activity/ingreso/:id", getActividadByIngreso);

router.post("/activity", createActividad);

router.put("/activity/:id", updateActividad);

router.delete("/activity/:id", deleteActividad);

export default router;
