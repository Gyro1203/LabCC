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
        showErrorAlert("Error al resgistrar la asistencia");
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