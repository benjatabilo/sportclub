import { Badge } from "react-bootstrap";

/**
 * Badge reutilizable para mostrar el campo "status" (boolean) de
 * deportes, salas, asignaciones y horarios. Antes este mismo bloque
 * estaba copiado en 5 archivos distintos.
 */
function StatusBadge({ active, activeLabel = "Activo", inactiveLabel = "Inactivo" }) {
  return (
    <Badge bg={active ? "success" : "secondary"}>
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}

export default StatusBadge;