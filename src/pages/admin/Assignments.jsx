import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { authFetch } from "../../services/apiFetch";
import StatusBadge from "../../components/StatusBadge";
import PageLoader from "../../components/PageLoader";
import EmptyTableRow from "../../components/EmptyTableRow";
import TableCard from "../../components/TableCard";
import ActionButtons from "../../components/ActionButtons";
import {
  getSportRooms,
  createSportRoom,
  updateSportRoom,
  deleteSportRoom,
} from "../../services/sportRoomService";
import Swal from "sweetalert2";

const emptyForm = { sport_id: "", room_id: "", coach_id: "", observation: "" };

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [listas, setListas] = useState({ rooms: [], sports: [], coaches: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [assignRes, roomsRes, sportsRes, usersRes] = await Promise.all([
        getSportRooms(),
        authFetch("/rooms"),
        authFetch("/sports"),
        authFetch("/users"),
      ]);

      const usersList = usersRes.data || [];

      setAssignments(assignRes.data || []);
      setListas({
        rooms: roomsRes.data || [],
        sports: sportsRes.data || [],
        coaches: usersList.filter((u) => u.role === "coach"),
      });
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openCreateModal = () => {
    setEditingAssignment(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setForm({
      sport_id: assignment.sport_id,
      room_id: assignment.room_id,
      coach_id: assignment.coach_id,
      observation: assignment.observation || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAssignment(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        sport_id: Number(form.sport_id),
        room_id: Number(form.room_id),
        coach_id: Number(form.coach_id),
        observation: form.observation,
      };

      if (editingAssignment) {
        await updateSportRoom(editingAssignment.id, payload);
        Swal.fire("Éxito", "Asignación actualizada correctamente", "success");
      } else {
        await createSportRoom(payload);
        Swal.fire("Éxito", "Asignación creada correctamente", "success");
      }

      closeModal();
      loadAll();
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo guardar la asignación", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (assignment) => {
    const result = await Swal.fire({
      title: "¿Eliminar asignación?",
      text: `Se eliminará ${assignment.sport?.name || "esta asignación"} en ${assignment.room?.name || "la sala"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        await deleteSportRoom(assignment.id);
        Swal.fire("Eliminado", "La asignación fue eliminada", "success");
        loadAll();
      } catch (error) {
        Swal.fire("Error", error.message || "No se pudo eliminar la asignación", "error");
      }
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <TableCard title="Gestión de Asignaciones" actionLabel="+ Nueva Asignación" onAction={openCreateModal}>
        <Table hover responsive className="mb-0 align-middle">
          <thead>
            <tr className="text-muted" style={{ fontSize: "0.8rem" }}>
              <th className="ps-3 py-2">Deporte</th>
              <th className="py-2">Sala</th>
              <th className="py-2">Coach</th>
              <th className="py-2">Observación</th>
              <th className="py-2">Estado</th>
              <th className="pe-3 py-2 text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((a) => (
                <tr key={a.id}>
                  <td className="ps-3 fw-semibold">{a.sport?.name || "-"}</td>
                  <td className="text-muted">{a.room?.name || "-"}</td>
                  <td className="text-muted">{a.coach?.full_name || a.coach?.email || "-"}</td>
                  <td className="text-muted" style={{ maxWidth: 240 }}>{a.observation || "-"}</td>
                  <td>
                    <StatusBadge active={a.status} activeLabel="Activa" inactiveLabel="Inactiva" />
                  </td>
                  <td className="pe-3">
                    <ActionButtons
                      onEdit={() => openEditModal(a)}
                      onDelete={() => handleDelete(a)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <EmptyTableRow colSpan={6} message="No hay asignaciones registradas." />
            )}
          </tbody>
        </Table>
      </TableCard>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton closeVariant="white" className="text-white border-0 py-2" style={{ background: "linear-gradient(90deg, #1a1420 0%, #ff7c2a 100%)" }}>
          <Modal.Title className="fw-bold" style={{ fontSize: "1.1rem" }}>
            {editingAssignment ? "Editar Asignación" : "Nueva Asignación"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Row className="g-2 mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Sala</Form.Label>
                  <Form.Select
                    size="sm"
                    required
                    value={form.room_id}
                    onChange={(e) => setForm({ ...form, room_id: e.target.value })}
                  >
                    <option value="">Seleccione una sala</option>
                    {listas.rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Deporte</Form.Label>
                  <Form.Select
                    size="sm"
                    required
                    value={form.sport_id}
                    onChange={(e) => setForm({ ...form, sport_id: e.target.value })}
                  >
                    <option value="">Seleccione un deporte</option>
                    {listas.sports.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Coach</Form.Label>
              <Form.Select
                size="sm"
                required
                value={form.coach_id}
                onChange={(e) => setForm({ ...form, coach_id: e.target.value })}
              >
                <option value="">Seleccione un coach</option>
                {listas.coaches.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name || c.email}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Observación (opcional)</Form.Label>
              <Form.Control
                size="sm"
                as="textarea"
                rows={2}
                maxLength={255}
                value={form.observation}
                onChange={(e) => setForm({ ...form, observation: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="border-0 pt-0 px-3 pb-3">
            <Button size="sm" variant="outline-secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button size="sm" type="submit" className="fw-semibold border-0" style={{ backgroundColor: "#ff7c2a" }} disabled={saving}>
              {saving ? <Spinner size="sm" animation="border" /> : "Guardar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Assignments;