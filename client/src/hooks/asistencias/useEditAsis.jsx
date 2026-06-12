import { useState } from "react";
import { updateUsuariosRequest } from "../../services/usuarios.api.js";
import { showSuccessAlert, showErrorAlert } from "../../helpers/sweetAlert.js";

const useEditAsis = (setUsers) => {
  const [isEditPopUpOpen, setIsEditPopUpOpen] = useState(false);
  const [dataAsistencia, setDataAsistencia] = useState([]);

  const handleClickUpdate = (asistencia) => {
    console.log("handleClickUpdate", asistencia);
    if (asistencia && asistencia.id_asistencia) {
      setDataAsistencia(asistencia);
      setIsEditPopUpOpen(true);
    }
  };

  const handleUpdate = async (formData) => {
    if (formData) {
      try {
        const updatedUser = await updateUsuariosRequest(
          dataAsistencia.id_usuario,
          formData
        );
        const usuarioActualizado = updatedUser.data.data;
        showSuccessAlert("Usuario actualizado exitosamente");
        setIsEditPopUpOpen(false);

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id_usuario === usuarioActualizado.id_usuario ? usuarioActualizado : user
          )
        );
        setDataAsistencia([]);
      } catch (error) {
        const errorMessage =
          error.response?.data?.details ||
          error.response?.data?.message ||
          error.message ||
          "Error desconocido";
        showErrorAlert("Error al actualizar el usuario", errorMessage);
        console.error("Error al actualizar el usuario:", error.response || error);
        console.error("Error al actualizar usuario:", error);
      }
    }
  };

  return {
    isEditPopUpOpen,
    setIsEditPopUpOpen,
    dataAsistencia,
    setDataAsistencia,
    handleClickUpdate,
    handleUpdate,
  };
};

export default useEditAsis;
