"use strict";
import { Router } from "express";
import { getUsuarios,
         getUsuariosId,
         createUsuario,
         updateUsuarios,
         deleteUsuarios
} from "../controllers/usuariosController.js";

const router = Router();

router.get("/users", getUsuarios);

router.get("/users/:id", getUsuariosId);

router.post("/users", createUsuario);

router.put("/users/:id", updateUsuarios);

router.delete("/users/:id", deleteUsuarios);

export default router;
