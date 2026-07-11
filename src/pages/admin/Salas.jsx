import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../services/roomService";
import StatusBadge from "../../components/StatusBadge";
import PageLoader from "../../components/PageLoader";
import EmptyTableRow from "../../components/EmptyTableRow";
import TableCard from "../../components/TableCard";
import ActionButtons from "../../components/ActionButtons";

function Salas() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const response = await getRooms(); // Consume el endpoint GET /api/rooms[cite: 1]
      setSalas(response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las salas", "error");
    } finally {
      setLoading(false);
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

  const handleToggleStatus = async (sala) => {
    try {
      await updateRoom(sala.id, { status: !sala.status });
      loadSalas();
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <TableCard
        title="Gestión de Salas"
        actionLabel="+ Nueva Sala"
        onAction={() => { setEditingSala(null); setFormData({ name: "", capacity: "", location: "", description: "" }); setShowModal(true); }}
      >
        <Table hover responsive className="mb-0 align-middle">
          <thead>
            <tr className="text-muted" style={{ fontSize: "0.8rem" }}>
              <th className="ps-3 py-2">Nombre</th>
              <th className="py-2">Capacidad</th>
              <th className="py-2">Ubicación</th>
              <th className="py-2">Descripción</th>
              <th className="py-2">Estado</th>
              <th className="pe-3 py-2 text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {salas.length > 0 ? (
              salas.map((sala) => (
                <tr key={sala.id}>
                  <td className="ps-3 fw-semibold">{sala.name}</td>
                  <td>
                    <span className="badge bg-light text-dark border fw-normal">{sala.capacity} pers.</span>
                  </td>
                  <td className="text-muted">{sala.location}</td>
                  <td className="text-muted" style={{ maxWidth: 280 }}>{sala.description || "-"}</td>
                  <td>
                    <StatusBadge active={sala.status} activeLabel="Activa" inactiveLabel="Inactiva" />
                  </td>
                  <td className="pe-3">
                    <ActionButtons
                      onEdit={() => { setEditingSala(sala); setFormData(sala); setShowModal(true); }}
                      onToggleStatus={() => handleToggleStatus(sala)}
                      active={sala.status}
                      onDelete={() => handleDelete(sala.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <EmptyTableRow colSpan={6} message="No hay salas registradas." />
            )}
          </tbody>
        </Table>
      </TableCard>

      {/* MODAL CON EL FORMULARIO COMPLETO */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton closeVariant="white" className="text-white border-0 py-2" style={{ background: "linear-gradient(90deg, #1a1420 0%, #ff7c2a 100%)" }}>
          <Modal.Title className="fw-bold" style={{ fontSize: "1.1rem" }}>{editingSala ? "Editar Sala" : "Nueva Sala"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Nombre</Form.Label>
              <Form.Control size="sm" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </Form.Group>
            <Row className="g-2 mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Capacidad</Form.Label>
                  <Form.Control size="sm" type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Ubicación</Form.Label>
                  <Form.Control size="sm" type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Descripción</Form.Label>
              <Form.Control size="sm" as="textarea" rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 px-3 pb-3">
            <Button size="sm" variant="outline-secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button size="sm" type="submit" className="fw-semibold border-0" style={{ backgroundColor: "#ff7c2a" }}>Guardar Sala</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Salas;