import { useEffect, useState } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";

const BRAND = "#ff7c2a";
const DARK = "#1a1420";
const SPORT_OPTIONS = ["Ninguno", "Fútbol", "Tenis", "Basquetbol", "Otro"];

const initialForm = {
  full_name: "",
  email: "",
  role: "user",
  password: "",
  birth_date: "",
  sport: "Ninguno",
  otherSport: "",
};

function UserFormModal({ show, handleClose, handleSave, selectedUser }) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (selectedUser) {
      // metadata.sports es un arreglo de objetos { name, frequency_per_week }
      // (ver user.validator.js -> normalizeMetadata). Tomamos el primero, si existe.
      const existingSport = selectedUser.metadata?.sports?.[0]?.name;
      const isKnownSport = SPORT_OPTIONS.includes(existingSport);
      setFormData({
        full_name: selectedUser.full_name || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "user",
        password: "",
        birth_date: selectedUser.birth_date || "",
        sport: existingSport ? (isKnownSport ? existingSport : "Otro") : "Ninguno",
        otherSport: existingSport && !isKnownSport ? existingSport : "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [selectedUser, show]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const finalSport = formData.sport === "Otro" ? formData.otherSport.trim() : formData.sport;

    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role,
      birth_date: formData.birth_date || null,
      metadata: {
        sports: finalSport && finalSport !== "Ninguno"
          ? [{ name: finalSport, frequency_per_week: 1 }]
          : [],
      },
    };

    // La contraseña solo se envía al crear (en edición el backend la deja
    // intacta si no se manda, ver user.validator.js -> partial update).
    if (!selectedUser) {
      payload.password = formData.password;
    }

    handleSave(payload);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="text-white border-0 py-2"
        style={{ background: `linear-gradient(90deg, ${DARK} 0%, ${BRAND} 100%)` }}
      >
        <Modal.Title className="fw-bold" style={{ fontSize: "1.1rem" }}>
          {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body className="p-3" style={{ backgroundColor: "#f8f9fa" }}>
          <Form.Group className="mb-2">
            <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Nombre Completo</Form.Label>
            <Form.Control
              size="sm"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="g-2 mb-2">
            <Col md={selectedUser ? 12 : 6}>
              <Form.Group>
                <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Correo</Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {!selectedUser && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Contraseña</Form.Label>
                  <Form.Control
                    size="sm"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            )}
          </Row>

          <Row className="g-2 mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  size="sm"
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Rol</Form.Label>
                <Form.Select size="sm" name="role" value={formData.role} onChange={handleChange}>
                  <option value="user">Usuario</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-2">
            <Col md={formData.sport === "Otro" ? 6 : 12}>
              <Form.Group>
                <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Deporte de Interés</Form.Label>
                <Form.Select size="sm" name="sport" value={formData.sport} onChange={handleChange}>
                  {SPORT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {formData.sport === "Otro" && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>¿Cuál?</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="otherSport"
                    value={formData.otherSport}
                    onChange={handleChange}
                    placeholder="Ej: Natación"
                  />
                </Form.Group>
              </Col>
            )}
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 px-3 pb-3">
          <Button size="sm" variant="outline-secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button size="sm" type="submit" className="fw-semibold border-0" style={{ backgroundColor: BRAND }}>
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UserFormModal;