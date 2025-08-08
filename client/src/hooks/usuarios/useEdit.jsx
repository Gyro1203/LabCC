import { useState } from "react";
import { updateUsuariosRequest } from "../../services/usuarios.api.js";
import { showSuccessAlert, showErrorAlert } from "../../helpers/sweetAlert.js";

const useEdit = (setUsers) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dataUser, setDataUser] = useState([]);

  const handleClickUpdate = (dataUser) => {
    console.log("handleClickUpdate", dataUser);
    if (dataUser && dataUser.id_usuario) {
      setDataUser(dataUser);
      setIsPopupOpen(true);
    }
  };

  const handleUpdate = async (formData) => {
    if (formData) {
      try {
        const updatedUser = await updateUsuariosRequest(
          dataUser.id_usuario,
          formData
        );
        const usuarioActualizado = updatedUser.data.data;
        showSuccessAlert("Usuario actualizado exitosamente");
        setIsPopupOpen(false);

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id_usuario === usuarioActualizado.id_usuario ? usuarioActualizado : user
          )
        );
        setDataUser([]);
      } catch (error) {
        showErrorAlert("Error al actualizar el usuario");
        console.error("Error al actualizar usuario:", error);
      }
    }
  };

  return {
    isPopupOpen,
    setIsPopupOpen,
    dataUser,
    setDataUser,
    handleClickUpdate,
    handleUpdate,
  };
};

export default useEdit;
