import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { authFetch } from "../../services/apiFetch";
import StatusBadge from "../../components/StatusBadge";
import PageLoader from "../../components/PageLoader";
import EmptyTableRow from "../../components/EmptyTableRow";
import TableCard from "../../components/TableCard";
import ActionButtons from "../../components/ActionButtons";
import Swal from "sweetalert2";

const emptyForm = { name: "", objective: "", duration: "" };

function Sports() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSport, setEditingSport] = useState(null);
  // El modelo Sport no tiene "description": tiene "objective" (obligatorio,
  // mín. 5 caracteres) y "duration" en minutos (obligatorio, entero > 0).
  // Ver sport.validator.js.
  const [formData, setFormData] = useState(emptyForm);

  const loadSports = async () => {
    try {
      setLoading(true);
      const response = await authFetch('/sports');
      setSports(response.data || []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los deportes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSports(); }, []);

  const openCreateModal = () => {
    setEditingSport(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (sport) => {
    setEditingSport(sport);
    setFormData({ name: sport.name, objective: sport.objective, duration: sport.duration });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSport(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      objective: formData.objective,
      duration: Number(formData.duration),
    };
    try {
      if (editingSport) {
        await authFetch(`/sports/${editingSport.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        Swal.fire("Éxito", "Deporte actualizado correctamente", "success");
      } else {
        await authFetch('/sports', { method: 'POST', body: JSON.stringify(payload) });
        Swal.fire("Éxito", "Deporte registrado", "success");
      }
      closeModal();
      loadSports();
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo guardar el deporte", "error");
    }
  };

  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      title: "¿Eliminar deporte?",
      text: `Se eliminará "${sport.name}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });
    if (result.isConfirmed) {
      try {
        await authFetch(`/sports/${sport.id}`, { method: 'DELETE' });
        Swal.fire("Eliminado", "Deporte eliminado correctamente", "success");
        loadSports();
      } catch (error) {
        Swal.fire("Error", error.message || "No se pudo eliminar el deporte", "error");
      }
    }
  };

  const handleToggleStatus = async (sport) => {
    try {
      // Endpoint dedicado del backend: PATCH /sports/:id/status
      await authFetch(`/sports/${sport.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: !sport.status }),
      });
      loadSports();
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo cambiar el estado", "error");
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <TableCard title="Gestión de Deportes" actionLabel="+ Nuevo Deporte" onAction={openCreateModal}>
        <Table hover responsive className="mb-0 align-middle">
          <thead>
            <tr className="text-muted" style={{ fontSize: "0.8rem" }}>
              <th className="ps-3 py-2">Nombre</th>
              <th className="py-2">Objetivo</th>
              <th className="py-2">Duración</th>
              <th className="py-2">Estado</th>
              <th className="pe-3 py-2 text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sports.length > 0 ? (
              sports.map(s => (
                <tr key={s.id}>
                  <td className="ps-3 fw-semibold">{s.name}</td>
                  <td className="text-muted" style={{ maxWidth: 320 }}>{s.objective}</td>
                  <td>
                    <span className="badge bg-light text-dark border fw-normal">{s.duration} min</span>
                  </td>
                  <td>
                    <StatusBadge active={s.status} activeLabel="Activo" inactiveLabel="Inactivo" />
                  </td>
                  <td className="pe-3">
                    <ActionButtons
                      onEdit={() => openEditModal(s)}
                      onToggleStatus={() => handleToggleStatus(s)}
                      active={s.status}
                      onDelete={() => handleDelete(s)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <EmptyTableRow colSpan={5} message="No hay deportes registrados." />
            )}
          </tbody>
        </Table>
      </TableCard>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton closeVariant="white" className="text-white border-0 py-2" style={{ background: "linear-gradient(90deg, #1a1420 0%, #ff7c2a 100%)" }}>
          <Modal.Title className="fw-bold" style={{ fontSize: "1.1rem" }}>{editingSport ? "Editar Deporte" : "Nuevo Deporte"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Row className="g-2 mb-2">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Nombre</Form.Label>
                  <Form.Control size="sm" required minLength={3} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Duración (min)</Form.Label>
                  <Form.Control size="sm" type="number" min={1} required value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Objetivo</Form.Label>
              <Form.Control size="sm" as="textarea" rows={3} required minLength={5} value={formData.objective} onChange={(e) => setFormData({ ...formData, objective: e.target.value })} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 px-3 pb-3">
            <Button size="sm" variant="outline-secondary" onClick={closeModal}>Cancelar</Button>
            <Button size="sm" type="submit" className="fw-semibold border-0" style={{ backgroundColor: "#ff7c2a" }}>Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Sports;