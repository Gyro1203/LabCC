import db from '../config/db.js';

export const getEnsayos = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM ensayos");
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getEnsayo = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM ensayos WHERE id_ensayo = ?", [req.params.id]);
        if (result.length <= 0) return res.status(404).json({ message: "Ensayo no encontrado" });
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const createEnsayo = async (req, res) => {
    try {
        let UF = 39174;
        const { nombre, tipo, precio_uf } = req.body;
        const [result] = await db.query("INSERT INTO ensayos (nombre, tipo, precio_uf, precio_peso) VALUES (?, ?, ?, ?)", [nombre, tipo, precio_uf, precio_uf * UF]);
        console.log(result);
        res.status(201).json({ id: result.insertId, nombre, tipo, precio_uf, precio_peso: precio_uf * UF });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateEnsayo = async (req, res) => {
    try {
        let UF = 39174;
        const [result] = await db.query("UPDATE ensayos SET ?, precio_peso = ? WHERE id_ensayo = ?", [req.body, req.body.precio_uf * UF, req.params.id]);
        console.log(result);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Ensayo no encontrado" });
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteEnsayo = async (req,res) => {
    try {
        const [result] = await db.query("DELETE FROM ensayos WHERE id_ensayo = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Ensayo no encontrado" });
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};