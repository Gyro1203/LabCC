import { Router } from "express";
import { getEnsayos, getEnsayo, createEnsayo, updateEnsayo, deleteEnsayo } from "../controllers/ensayosController.js";

const router = Router();

router.get("/essay", getEnsayos);

router.get("/essay/:id", getEnsayo);

router.post("/essay", createEnsayo);

router.put("/essay/:id", updateEnsayo);

router.delete("/essay/:id", deleteEnsayo);

export default router;
