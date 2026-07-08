import { useState } from "react";
import { Modal, Button, Form, Badge, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { authFetch } from "../services/apiFetch";

const ROLE_LABELS = {
  admin: "Administrador",
  coach: "Coach",
  user: "Usuario",
};

function UserProfile({ show, onHide, user, onUpdateSuccess, brandColor = "#ff7c2a" }) {
  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });

  const resetAndClose = () => {
    setEditingName(false);
    setEditingPassword(false);
    setFullName(user?.full_name || "");
    setPasswords({ password: "", confirm: "" });
    onHide();
  };

  const handleSaveName = async () => {
    const trimmed = fullName.trim();
    if (trimmed.length < 3) {
      Swal.fire("Error", "El nombre completo debe tener al menos 3 caracteres", "error");
      return;
    }

    setSaving(true);
    try {
      // Actualización parcial: solo se envía full_name (el backend acepta
      // payloads parciales, ver user.validator.js -> partial: true).
      const response = await authFetch(`/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ full_name: trimmed }),
      });
      Swal.fire("Éxito", "Nombre actualizado correctamente", "success");
      setEditingName(false);
      onUpdateSuccess(response.data);
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo actualizar el nombre", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (passwords.password.length < 8) {
      Swal.fire("Error", "La contraseña debe tener al menos 8 caracteres", "error");
      return;
    }
    if (passwords.password !== passwords.confirm) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    setSaving(true);
    try {
      await authFetch(`/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ password: passwords.password }),
      });
      Swal.fire("Éxito", "Contraseña actualizada correctamente", "success");
      setEditingPassword(false);
      setPasswords({ password: "", confirm: "" });
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo actualizar la contraseña", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={resetAndClose} centered>
      <div style={{ borderRadius: "0.5rem", overflow: "hidden" }}>
        {/* Cabecera con degradado de marca */}
        <div
          className="text-white text-center position-relative"
          style={{
            background: `linear-gradient(135deg, ${brandColor} 0%, #2b2b2b 150%)`,
            padding: "2rem 1.5rem 3.5rem",
          }}
        >
          <Button
            variant="link"
            onClick={resetAndClose}
            className="position-absolute top-0 end-0 text-white text-decoration-none fs-4 p-2"
            style={{ lineHeight: 1 }}
          >
            &times;
          </Button>
          <div
            className="d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "3px solid rgba(255,255,255,0.6)",
              fontSize: "2.2rem",
              fontWeight: "bold",
            }}
          >
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <h5 className="mb-1 fw-bold">{user?.full_name}</h5>
          <Badge bg="light" text="dark" className="fw-semibold px-3 py-2">
            {ROLE_LABELS[user?.role] || user?.role}
          </Badge>
        </div>

        {/* Cuerpo con tarjetas sobre fondo gris, estilo dashboard */}
        <div style={{ backgroundColor: "#f4f5f7", padding: "1.5rem", marginTop: "-1.75rem" }}>
          <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: "0.9rem" }}>
            <Card.Body>
              <Form.Label className="text-muted small text-uppercase fw-semibold mb-1">
                Correo Electrónico
              </Form.Label>
              <Form.Control value={user?.email || ""} disabled readOnly className="bg-white" />
              <Form.Text className="text-muted">El correo no se puede modificar.</Form.Text>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: "0.9rem" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">Nombre Completo</span>
                {!editingName && (
                  <Button
                    size="sm"
                    style={{ backgroundColor: brandColor, border: "none" }}
                    onClick={() => setEditingName(true)}
                  >
                    Editar
                  </Button>
                )}
              </div>
              <Form.Control
                value={fullName}
                disabled={!editingName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {editingName && (
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => {
                      setEditingName(false);
                      setFullName(user?.full_name || "");
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    style={{ backgroundColor: brandColor, border: "none" }}
                    onClick={handleSaveName}
                    disabled={saving}
                  >
                    Guardar
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm" style={{ borderRadius: "0.9rem" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">Contraseña</span>
                {!editingPassword && (
                  <Button
                    size="sm"
                    style={{ backgroundColor: brandColor, border: "none" }}
                    onClick={() => setEditingPassword(true)}
                  >
                    Cambiar Contraseña
                  </Button>
                )}
              </div>

              {editingPassword ? (
                <>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="password"
                      placeholder="Nueva contraseña (mín. 8 caracteres)"
                      value={passwords.password}
                      onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="password"
                      placeholder="Confirmar nueva contraseña"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => {
                        setEditingPassword(false);
                        setPasswords({ password: "", confirm: "" });
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      style={{ backgroundColor: brandColor, border: "none" }}
                      onClick={handleSavePassword}
                      disabled={saving}
                    >
                      Guardar
                    </Button>
                  </div>
                </>
              ) : (
                <Form.Control value="••••••••" disabled readOnly />
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </Modal>
  );
}

export default UserProfile;