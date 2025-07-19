import { useSession } from "@context/SessionContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useSession();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.rol)) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;