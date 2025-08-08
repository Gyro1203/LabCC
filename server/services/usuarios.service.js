"use strict";
import db from '../config/db.js';
import { encryptPassword, comparePassword } from '../helpers/bcrypt.helper.js';


// ver usuarios
export const getUsuariosService = async () => {

    try{
        const [result] = await db.query("SELECT * FROM usuarios");
        if(!result || result.length === 0) return [null, "No hay usuarios registrados"];
        return[result, null];
    }catch (error){
        console.error("Error al obtener todos los usuarios: ", error);
        return[null, "Error interno del servidor"];
     }

};

// ver un usuario
export const getUsuariosIdService = async (id) => {

    try {
        const [result] = await db.query("SELECT * FROM usuarios WHERE id_usuario = ?", id);
        if (!result || result.length === 0) return [null, "No se encontró al usuario"];
        return [result[0], null];
    } catch (error) {
        console.error("Error al obtener usuario", error);
        return [null, "Error interno del servidor"];
    }
}


// crear un usuario
export const createUsuariosService = async (body) => {

    try{
        const {nombre_usuario, rol, email, password} = body;

        const [existeUsuario] = await db.query("SELECT * FROM usuarios WHERE email = ?", email);
        if(existeUsuario[0]) return [null, "Ya existe un usuario con este email"];

        const encryptedPassword = await encryptPassword(password)

        const [result] = await db.query("INSERT INTO usuarios (nombre_usuario, rol, email, password) VALUES (?, ?, ?, ?)",
             [nombre_usuario, rol, email, encryptedPassword]);
        if(result.affectedRows === 0) return [null, "Error en la creación"];

        const [created] = await db.query("SELECT * FROM usuarios WHERE email = ?", email);
        if(!created) return [null, "Usuario no encontrado despues de ser creado"];

        return[created[0], null];


    }catch (error){
        console.error("Error al crear un usuario", error);
        return [null, "Error interno del servidor"];
    }

}

// actualizar un usuario
export const updateUsuariosService = async (body, id) => {
    try{
        const [actualizarUsuario] = await db.query("SELECT * FROM usuarios WHERE id_usuario = ?", id);
        if(!actualizarUsuario || actualizarUsuario.length === 0) return [null, "No se encontró el usuario"];

        const [existeUsuarios] = await db.query("SELECT * FROM usuarios WHERE email = ?", body.email);


        if(existeUsuarios[0] && existeUsuarios[0].email !== actualizarUsuario[0].email) 
        return [null, "Ya existe un usuario con este email"];

        // comprobar si viene una contraseña nueva
        // si viene una contraseña nueva, encriptarla y actualizar el body
        let updatedBody;
        if(body.password !== null && body.password !== undefined && body.password !== ""){
        const encryptedPassword = await encryptPassword(body.password);
        updatedBody = { ...body, password: encryptedPassword };
        }else{
        updatedBody = { 
            nombre_usuario: body.nombre_usuario,
            rol: body.rol,
            email: body.email
         };
        }

        await db.query("UPDATE usuarios SET ? WHERE id_usuario = ?", [updatedBody, id]);

        const [usuario] = await db.query("SELECT * FROM usuarios WHERE id_usuario = ?", id);
        if(!usuario) return [null, "Usuario no encontrado despues de ser creado"];

        return[usuario[0], null];

    }catch(error){
        console.error("Error al actualizar un usuario", error);
        return [null, "Error interno del servidor"];
    }
}

// borrar un usuario
export const deleteUsuariosService = async (id) => {
    try{
        const [result] = await db.query("SELECT * FROM usuarios WHERE id_usuario = ?", id);
        if (!result || result.length === 0) return [null, "No se encontró al usuario"];
        const [deleted] = await db.query("DELETE FROM usuarios WHERE id_usuario = ?", id);
        if(deleted.affectedRows === 0) return [null, "No se pudo borrar al usuario"];
        return [result[0], null];
    }catch (error){
        console.error("Error al borrar un usuario", error);
        return [null, "Error interno del servidor"];
    }
}