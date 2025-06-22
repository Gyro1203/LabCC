"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';
import { getUsuariosService,
         getUsuariosIdService,
         createUsuariosService,
         updateUsuariosService,
         deleteUsuariosService
 } from '../services/usuarios.service.js';

 export const getUsuarios = async (req, res) => {

    try{
        const [usuarios, errorUsuarios] = await getUsuariosService();
        if(errorUsuarios) return handleErrorClient(res, 404, errorUsuarios);
        usuarios.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Registro de usuarios encontrado", usuarios);
    }catch (error){
        handleErrorServer(res, 500, error.message);
    }
 };

 export const getUsuariosId = async (req, res) => {

    try {
        const [usuario, errorUsuario] = await getUsuariosIdService([req.params.id]);
        if (errorUsuario) return handleErrorClient(res, 404, errorUsuario);
        handleSuccess(res, 200, "Usuario encontrado", usuario);
     } catch (error) {
         handleErrorServer(res, 500, error.message);
    }
 };

 export const createUsuario = async (req, res) => {

    try {
         const { nombre_usuario, rol, email, password } = req.body;
         const [usuario, errorUsuario] = await createUsuariosService({ nombre_usuario, rol, email, password });
         if(errorUsuario) return handleErrorClient(res, 400, "Error al crear usuario", errorUsuario);
         handleSuccess(res, 201, "Usuario creado exitosamente", usuario);
        } catch (error) {
          console.error("Error al crear un usuario", error);
          handleErrorServer(res, 500, error.message);
        }

};

export const updateUsuarios = async (req, res) => {
     try {
            const [usuario, errorUsuario] = await updateUsuariosService(req.body, req.params.id);
            if(errorUsuario) return handleErrorClient(res, 400, "Error al actualizar usuario", errorUsuario);
            handleSuccess(res, 200, "Datos del alumno actualizados", usuario);
        } catch (error) {
            handleErrorServer(res, 500, error.message);
        }
}

export const deleteUsuarios = async (req, res) => {
    try {
            const [usuario, errorUsuario] = await deleteUsuariosService(req.body, req.params.id);
            if(errorUsuario) return handleErrorClient(res, 400, "Error al eliminar usuario", errorUsuario);
            handleSuccess(res, 200, "Usuario eliminado exitosamente", usuario);
        } catch (error) {
            handleErrorServer(res, 500, error.message);
        }

}
 