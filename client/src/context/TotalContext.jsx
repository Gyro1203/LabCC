import { createContext, useContext, useState } from "react";
import { getAlumnosRequest } from "../services/alumnos.api";

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
  const [totalesUF, setTotalesUF] = useState([]);

  function GetUF(id) {
    const fetchAlumnos = async () => {
      try {
        const dataAlumnos = await getAlumnosRequest();
      } catch (error) {
        console.log("Error al obtener alumnos:", error); // En caso de error el contenido es vacio.
      }
    };
    fetchAlumnos();
  }

  return (
    <TotalContext.Provider value={{ text: "Hello, World!" }}>
      {children}
    </TotalContext.Provider>
  );
};
