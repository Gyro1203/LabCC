import { createContext, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SessionContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("usuario"));
  const isAuthenticated = user && user.rol;
  
  useEffect(() => {
    const publicRoutes = ["/", "/attendance"];
    if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
      navigate("/login");
    }
  }, [isAuthenticated, location.pathname, navigate]);

return (
    <SessionContext.Provider value={{ isAuthenticated, user }}>
        {children}
    </SessionContext.Provider>
    );
}
