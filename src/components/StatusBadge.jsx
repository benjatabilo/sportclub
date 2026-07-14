import { Badge } from "react-bootstrap";

function StatusBadge({ active, activeLabel = "Activo", inactiveLabel = "Inactivo" }) {
  return (
    <Badge bg={active ? "success" : "secondary"}>
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}

export default StatusBadge;