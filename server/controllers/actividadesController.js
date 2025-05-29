import db from '../config/db.js';

export const getActividades = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM actividades");
        // const [result] = await db.query(`
        //     SELECT 
        //         a.Nombre, 
        //         a.Rut, 
        //         i.motivo, 
        //         i.titulo, 
        //         i.profesor_guia, 
        //         i.profesor_asignatura, 
        //         i.semestre 
        //     FROM ingresos i 
        //     JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
        // `);
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getActividad = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM actividades WHERE id_actividad = ?", [req.params.id]);
        // const [result] = await db.query(`
        //     SELECT 
        //         a.Nombre, 
        //         a.Rut, 
        //         i.motivo, 
        //         i.titulo, 
        //         i.profesor_guia, 
        //         i.profesor_asignatura, 
        //         i.semestre 
        //     FROM ingresos i 
        //     JOIN alumnos a ON i.ingreso_alumno = a.id_alumno
        //     WHERE i.id_ingreso = ?
        // `, [req.params.id]);
        if (result.length <= 0) return res.status(404).json({ message: "Actividad no encontrado" });
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const createActividad = async (req, res) => {
    try {
        let existeAlumno = false;
        let existeIngreso = false;
        let existeEnsayo = false;
        const { nombre, unidad, cantidad, precio_uf, precio_peso, observaciones, actividad_alumno, actividad_ensayo, actividad_ingreso } = req.body;
        const [alumnos] = await db.query("SELECT id_alumno FROM alumnos");
        const [ingresos] = await db.query("SELECT id_ingreso FROM ingresos");
        const [ensayos] = await db.query("SELECT id_ensayo FROM ensayos");
        for(let alumno of alumnos){
            if(alumno.id_alumno == actividad_alumno){
                existeAlumno = true;
                console.log("Alumnos");
                break;
            }
        }
        for(let ingreso of ingresos){
            if(ingreso.id_ingreso == actividad_ingreso){
                existeIngreso= true;
                console.log("Ingreso");
                break;
            }
        }
        for(let ensayo of ensayos){
            if(ensayo.id_ensayo == actividad_ensayo){
                existeEnsayo = true;
                console.log("Ensayo");
                break;
            }
        }
        if(!existeAlumno){
            return res.status(404).json({ message: "El alumno no existe" });
        }else if(!existeIngreso){
            return res.status(404).json({ message: "El ingreso no existe" });
        }else if(!existeEnsayo){
            return res.status(404).json({ message:  "La actividad no se encuentra registrara entre los ensayos" });
        }else{
            const [result] = await db.query(`
            INSERT INTO actividades (
                nombre,
                unidad,
                cantidad,
                precio_uf,
                precio_peso,
                total_uf,
                total_peso,
                observaciones,
                actividad_alumno,
                actividad_ensayo,
                actividad_ingreso
            )VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ,[nombre, unidad, cantidad, precio_uf, precio_peso, (precio_uf * cantidad), (precio_peso * cantidad), observaciones, actividad_alumno, actividad_ensayo, actividad_ingreso]);
            console.log(result);
            res.status(201).json({ id: result.insertId, nombre, unidad, cantidad, precio_uf, precio_peso, "total_uf": (precio_uf * cantidad), "total_peso": (precio_peso * cantidad), observaciones, actividad_alumno, actividad_ensayo, actividad_ingreso });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateActividad = async (req, res) => {
    try {
        let existeAlumno = false;
        let existeIngreso = false;
        let existeEnsayo = false;
        const [alumnos] = await db.query("SELECT id_alumno FROM alumnos");
        const [ingresos] = await db.query("SELECT id_ingreso FROM ingresos");
        const [ensayos] = await db.query("SELECT id_ensayo FROM ensayos");
        for(let alumno of alumnos){
            if(alumno.id_alumno == req.body.actividad_alumno){
                existeAlumno = true;
                console.log("Alumnos");
                break;
            }
        }
        for(let ingreso of ingresos){
            if(ingreso.id_ingreso == req.body.actividad_ingreso){
                existeIngreso= true;
                console.log("Ingreso");
                break;
            }
        }
        for(let ensayo of ensayos){
            if(ensayo.id_ensayo == req.body.actividad_ensayo){
                existeEnsayo = true;
                console.log("Ensayo");
                break;
            }
        }
        if(!existeAlumno){
            return res.status(404).json({ message: "El alumno no existe" });
        }else if(!existeIngreso){
            return res.status(404).json({ message: "El ingreso no existe" });
        }else if(!existeEnsayo){
            return res.status(404).json({ message:  "La actividad no se encuentra registrara entre los ensayos" });
        }else{
            const [result] = await db.query("UPDATE actividades SET ? WHERE id_actividad = ?", [req.body, req.params.id]);
            console.log(result);
            if (result.affectedRows === 0) return res.status(404).json({ message: "Actividad no encontrado" });
            res.json(result);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteActividad = async (req,res) => {
    try {
        const [result] = await db.query("DELETE FROM actividades WHERE id_actividad = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Actividad no encontrado" });
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};