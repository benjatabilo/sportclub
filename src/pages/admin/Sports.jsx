import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { authFetch } from "../../services/apiFetch";
import Swal from "sweetalert2";

function Sports() { // Nombre del componente actualizado
  const [sports, setSports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

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
        body: JSON.stringify(formData) 
      });
      Swal.fire("Éxito", "Deporte registrado", "success");
      setShowModal(false);
      loadSports();
      setFormData({ name: "", description: "" });
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el deporte", "error");
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
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {sports.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.description}</td>
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
              <Form.Control required onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </Form.Group>
            <Button type="submit">Guardar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Sports;