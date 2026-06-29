import { Navigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../services/authService";

function RoleRoute({ children, allowedRoles }) {
  // Verifica si el usuario ha iniciado sesión
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Para obtener la info del usuario log.
  const user = getUser();

  // para Verificar si el rol del usuario es pemritido.
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children  //ESTO CONSULTAR!!!! PORQUE PERMITE QUE SE VEA LA PGNA: 
}

export default RoleRoute;