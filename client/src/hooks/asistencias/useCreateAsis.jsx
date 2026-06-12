import {useState} from 'react'
import { showErrorAlert, showSuccessAlert } from '../../helpers/sweetAlert';
import { createAsistenciasRequest } from '../../services/asistencias.api';

const useCreateAsis = (setAsistencias) => {
  const [isCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false);

  const handleClickCreate = () => {
    setIsCreatePopUpOpen(true);
  };

  const handleCreate = async (formData) => {
    if (formData) {
      try {
        const dataAsistencia = await createAsistenciasRequest({
          rut: formData.rut,
          actividad: "",
        });
        showSuccessAlert("Asistencia registrada exitosamente");
        setIsCreatePopUpOpen(false);
      
        setAsistencias((prevAsistencias) => [...prevAsistencias, dataAsistencia.data]);
        //setCreateDataUser({});
      } catch (error) {
        const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.message ||
          error.message ||
          "Error desconocido";
        showErrorAlert("Error al registrar la asistencia", errorMessage);
        console.error("Error al registrar la asistencia:", error.response || error);
        console.error("Error al registrar la asistencia:", error);
      }
    }
  };

  return {
    isCreatePopUpOpen,
    setIsCreatePopUpOpen,
    handleClickCreate,
    handleCreate,
  };
}

export default useCreateAsis;