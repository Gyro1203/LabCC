import { useState } from "react";
import { showSuccessAlert, showErrorAlert } from "../../helpers/sweetAlert.js";
import { createUsuariosRequest } from "../../services/usuarios.api.js";


const useCreate = (setUsers) => {
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [dataCreateUser, setCreateDataUser] = useState({});
    
    const handleClickCreate = () => {
        setIsCreatePopupOpen(true);
    };
    
    const handleCreate = async (formData) => {
        if (formData) {
        try {
            const newUser = await createUsuariosRequest(formData);
            showSuccessAlert("Usuario creado exitosamente");
            setIsCreatePopupOpen(false);
    
            setUsers((prevUsers) => [...prevUsers, newUser.data]);
            setCreateDataUser({});
        } catch (error) {
            showErrorAlert("Error al crear el usuario");
            console.error("Error al crear usuario:", error);
        }
        }
    };
    
    return {
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataCreateUser,
        setCreateDataUser,
        handleClickCreate,
        handleCreate,
    };
}

export default useCreate;
