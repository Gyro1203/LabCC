import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("usuario"));
  const isAuthenticated = user && user.rol;
  
  useEffect(() => {
     if(!isAuthenticated) {
    navigate("/home");
    }
}, [isAuthenticated, navigate]);

return (
    <SessionContext.Provider value={{ isAuthenticated, user }}>
        {children}
    </SessionContext.Provider>
    );
}
