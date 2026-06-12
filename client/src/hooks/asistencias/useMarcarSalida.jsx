import {useState} from 'react'
import { showErrorAlert, showSuccessAlert } from '../../helpers/sweetAlert';
import { marcarSalidaRequest } from '../../services/asistencias.api';

const useMarcarSalida = (setAsistencias) => {
  const [isSalidaPopUpOpen, setIsSalidaPopUpOpen] = useState(false);
  const [dataAsistencia, setDataAsistencia] = useState({});

  const handleClickSalida = (asistencia) => {
    if(asistencia && asistencia.id_asistencia) {
      setDataAsistencia(asistencia);
      setIsSalidaPopUpOpen(true);
    }
  };

  const handleMarcarSalida = async (id, formData) => {
    // console.log("Handle Marcar Salida \n", formData);
    if (formData) {
      try {
        const dataAsistencia = await marcarSalidaRequest(id, {
          actividad: formData.actividad
        });
        
        showSuccessAlert("Has marcado tu salida");
        setIsSalidaPopUpOpen(false);
      
        setAsistencias((prevAsistencias) => [
          ...prevAsistencias.filter(
            (asis) => asis.id_asistencia != id
          ), dataAsistencia.data.data]);
      } catch (error) {
        const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.message ||
          error.message ||
          "Error desconocido";
        showErrorAlert("Error al marcar salida", errorMessage);
        console.error("Error al marcar la salida:", error.response || error);
      }
    }
  };

  return {
    isSalidaPopUpOpen,
    setIsSalidaPopUpOpen,
    dataAsistencia,
    setDataAsistencia,
    handleClickSalida,
    handleMarcarSalida,
  };
}

export default useMarcarSalida;