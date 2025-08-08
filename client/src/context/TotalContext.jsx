import { createContext, useContext, useState } from "react";
import {
  getActividadesRequest,
} from "../services/actividades.api";

const TotalContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTotalContext = () => {
  const context = useContext(TotalContext);
  if (!context) {
    throw new Error(
      "useTotalContext must be used within a TotalContextProvider"
    );
  }
  return context;
};

export const TotalContextProvider = ({ children }) => {
  const [actividades, setActividades] = useState([]);
  const [totalesUF, setTotalesUF] = useState([]);

  function GetUF() {
    const fetchTotalesUF = () => {
      actividades.map((actividad) => {
        setTotalesUF((prevData) => ({
          ...prevData, //Carga los datos anteriores del objeto para mantenerlos
          [actividad.id_alumno]:
            actividad && actividad.length > 0 // actualiza los datos del objeto con ese id
              ? actividad
            : [],
      }));
    })};
    fetchTotalesUF();
  }

  function GetActivities() {
    const fetchActivities = async () => {
      try {
        const dataActividades = await getActividadesRequest();
        setActividades(dataActividades.data);
      } catch (error) {
        console.log("Error al obtener actividades:", error);
        setActividades([]); // En caso de error el contenido es vacio.
      }
    };
    fetchActivities();
  }

  return (
    <TotalContext.Provider
      value={{
        actividades,
        totalesUF,
        GetUF,
        GetActivities,
      }}
    >
      {children}
    </TotalContext.Provider>
  );
};
