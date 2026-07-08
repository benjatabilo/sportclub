import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { authFetch } from "../../services/apiFetch";
import Swal from "sweetalert2";

function Sports() {
  const [sports, setSports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // El modelo Sport no tiene "description": tiene "objective" (obligatorio,
  // mín. 5 caracteres) y "duration" en minutos (obligatorio, entero > 0).
  // Ver sport.validator.js.
  const [formData, setFormData] = useState({ name: "", objective: "", duration: "" });

  const loadSports = async () => {
    try {
      const response = await authFetch('/sports');
      setSports(response.data || response || []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los deportes", "error");
    }
  };

  useEffect(() => { loadSports(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authFetch('/sports', { 
        method: 'POST', 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          objective: formData.objective,
          duration: Number(formData.duration),
        }) 
      });
      Swal.fire("Éxito", "Deporte registrado", "success");
      setShowModal(false);
      loadSports();
      setFormData({ name: "", objective: "", duration: "" });
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo guardar el deporte", "error");
    }
  };

  return (
    <Container className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h3>Gestión de Deportes</h3>
        <Button onClick={() => setShowModal(true)}>+ Nuevo Deporte</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Objetivo</th>
            <th>Duración (min)</th>
          </tr>
        </thead>
        <tbody>
          {sports.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.objective}</td>
              <td>{s.duration}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Nuevo Deporte</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control required minLength={3} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Objetivo</Form.Label>
              <Form.Control as="textarea" required minLength={5} value={formData.objective} onChange={(e) => setFormData({...formData, objective: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duración (minutos)</Form.Label>
              <Form.Control type="number" min={1} required value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
            </Form.Group>
            <Button type="submit">Guardar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Sports;