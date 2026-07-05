import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../services/roomService";
function Salas() {
  const [salas, setSalas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSala, setEditingSala] = useState(null);
  
  // Estado inicial con todos los campos del modelo de datos
  const [formData, setFormData] = useState({ 
    name: "", 
    capacity: "", 
    location: "", 
    description: "" 
  });

  const loadSalas = async () => {
    try {
      const response = await getRooms(); // Consume el endpoint GET /api/rooms[cite: 1]
      setSalas(response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las salas", "error");
    }
  };

  useEffect(() => { loadSalas(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSala) {
        await updateRoom(editingSala.id, formData); // Consume PUT /api/rooms/:id[cite: 1]
        Swal.fire("Éxito", "Sala actualizada correctamente", "success");
      } else {
        await createRoom(formData); // Consume POST /api/rooms[cite: 1]
        Swal.fire("Éxito", "Sala creada correctamente", "success");
      }
      setShowModal(false);
      loadSalas(); 
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar la sala", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      try {
        await deleteRoom(id); // Consume DELETE /api/rooms/:id[cite: 1]
        Swal.fire("Eliminado", "La sala ha sido eliminada", "success");
        loadSalas();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la sala", "error");
      }
    }
  };

  return (
    <Container className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h3>Gestión de Salas</h3>
        <Button variant="primary" onClick={() => { setEditingSala(null); setFormData({ name: "", capacity: "", location: "", description: "" }); setShowModal(true); }}>
          + Nueva Sala
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Capacidad</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {salas.map((sala) => (
            <tr key={sala.id}>
              <td>{sala.name}</td>
              <td>{sala.capacity}</td>
              <td>{sala.location}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => { setEditingSala(sala); setFormData(sala); setShowModal(true); }}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(sala.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODAL CON EL FORMULARIO COMPLETO */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingSala ? "Editar Sala" : "Nueva Sala"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button variant="primary" type="submit">Guardar Sala</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Salas;