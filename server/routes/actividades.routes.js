import { Router } from "express";
import { getActividades, getActividad, getActividadesByIngreso, createActividad, updateActividad, deleteActividad } from "../controllers/actividadesController.js";

const router = Router();

router.get("/activity", getActividades);

router.get("/activity/:id", getActividad);

router.get("/activity/entry/:id", getActividadesByIngreso);

router.post("/activity", createActividad);

router.put("/activity/:id", updateActividad);

router.delete("/activity/:id", deleteActividad);

export default router;
