import { Router } from "express";
import { getCarreras } from "../controllers/carreras.controller.js";

const router = Router();

router.get("/careers", getCarreras);

export default router;
