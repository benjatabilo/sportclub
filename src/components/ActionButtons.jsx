import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { EditIcon, TrashIcon, PowerIcon } from "./icons";

export function IconButton({ label, variant, onClick, children }) {
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{label}</Tooltip>}>
      <Button
        variant={variant}
        size="sm"
        onClick={onClick}
        className="d-inline-flex align-items-center justify-content-center"
        style={{ width: 32, height: 32, padding: 0 }}
      >
        {children}
      </Button>
    </OverlayTrigger>
  );
}

/**
 * Grupo compacto de botones de acción (Editar / Activar-Desactivar / Eliminar)
 * con ícono + tooltip, reutilizado en las tablas de gestión. onToggleStatus
 * es opcional (Usuarios, por ejemplo, no tiene esa acción).
 */
function ActionButtons({ onEdit, onDelete, onToggleStatus, active }) {
  return (
    <div className="d-flex justify-content-end gap-2">
      {onEdit && (
        <IconButton label="Editar" variant="outline-primary" onClick={onEdit}>
          <EditIcon />
        </IconButton>
      )}
      {onToggleStatus && (
        <IconButton
          label={active ? "Desactivar" : "Activar"}
          variant={active ? "outline-secondary" : "outline-success"}
          onClick={onToggleStatus}
        >
          <PowerIcon />
        </IconButton>
      )}
      {onDelete && (
        <IconButton label="Eliminar" variant="outline-danger" onClick={onDelete}>
          <TrashIcon />
        </IconButton>
      )}
    </div>
  );
}

export default ActionButtons;