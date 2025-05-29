import db from '../config/db.js';

export const getIngresos = async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT 
                i.id_ingreso,
                a.nombre, 
                a.rut, 
                i.motivo, 
                i.titulo, 
                i.profesor_guia, 
                i.profesor_asignatura, 
                i.semestre 
            FROM ingresos i 
            JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
        `);
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getIngreso = async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT
                i.id_ingreso,
                i.ingreso_alumno,
                a.nombre, 
                a.rut, 
                i.motivo, 
                i.titulo, 
                i.profesor_guia, 
                i.profesor_asignatura, 
                i.semestre
            FROM ingresos i 
            JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
            WHERE i.id_ingreso = ?
        `, [req.params.id]);
        if (result.length <= 0) return res.status(404).json({ message: "Ingreso solicitado no encontrado" });
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getIngresoActividades = async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT
                a.nombre, 
                a.rut, 
                i.motivo, 
                i.titulo, 
                i.profesor_guia, 
                i.profesor_asignatura, 
                i.semestre,
                ac.nombre
            FROM ingresos i 
            JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
            JOIN actividades ac ON i.id_ingreso = ac.actividad_ingreso
            WHERE i.id_ingreso = ?
        `, [req.params.id]);
        if (result.length <= 0) return res.status(404).json({ message: "Ingreso solicitado no encontrado" });
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const createIngreso = async (req, res) => {
    try {
        let existe = false;
        const { motivo, titulo, profesor_guia, profesor_asignatura, semestre, ingreso_alumno } = req.body;
        const [estudiantes] = await db.query("SELECT id_alumno FROM alumnos");
        for(let estudiante of estudiantes){
            if(estudiante.id_alumno == ingreso_alumno){
                existe = true;
                break;
            }
        }
        if(existe){
            const [result] = await db.query("INSERT INTO ingresos (motivo, titulo, profesor_guia, profesor_asignatura, semestre, ingreso_alumno) VALUES (?, ?, ?, ?, ?, ?)", [motivo, titulo, profesor_guia, profesor_asignatura, semestre, ingreso_alumno]);
            console.log(result);
            res.status(201).json({ id: result.insertId, motivo, titulo, profesor_guia, profesor_asignatura, semestre, ingreso_alumno });
        }else{
            return res.status(404).json({ message: "El alumno no existe" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateIngreso = async (req, res) => {
    try {
        let existe = false;
        const [estudiantes] = await db.query("SELECT id_alumno FROM alumnos");
        for(let estudiante of estudiantes){
            if(estudiante.id_alumno == req.body.ingreso_alumno){
                existe = true;
                break;
            }
        }
        if(existe){
            const [result] = await db.query("UPDATE ingresos SET ? WHERE id_ingreso = ?", [req.body, req.params.id]);
            console.log(result);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Ingreso solicitado no encontrado" });
            res.json(result);
        }else{
            return res.status(404).json({ message: "El alumno no existe" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteIngreso = async (req,res) => {
    try {
        const [result] = await db.query("DELETE FROM ingresos WHERE id_ingreso = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Ingreso solicitado no encontrado" });
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};