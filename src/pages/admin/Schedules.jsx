import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { authFetch } from "../../services/apiFetch";
import StatusBadge from "../../components/StatusBadge";
import PageLoader from "../../components/PageLoader";
import EmptyTableRow from "../../components/EmptyTableRow";
import TableCard from "../../components/TableCard";
import ActionButtons from "../../components/ActionButtons";
import { DIAS_SEMANA } from "../../components/ScheduleBadge";
import Swal from "sweetalert2";

const emptyForm = { sport_room_id: "", day_of_week: "", start_time: "", end_time: "" };

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [sportRooms, setSportRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = async () => {
    try {
      setLoading(true);
      // GET /class-schedules ya devuelve sportRoom.sport / sportRoom.room /
      // sportRoom.coach anidados (ver classSchedule.repository.js -> findAll),
      // así que no hace falta cruzar datos a mano: solo usarlos en la tabla.
      const [schedRes, srRes] = await Promise.all([
        authFetch('/class-schedules'),
        authFetch('/sport-rooms'),
      ]);
      setSchedules(schedRes.data || []);
      setSportRooms(srRes.data || []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreateModal = () => {
    setEditingSchedule(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      sport_room_id: schedule.sport_room_id,
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time?.substring(0, 5) || "",
      end_time: schedule.end_time?.substring(0, 5) || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
    setFormData(emptyForm);
  };

  const handleDelete = async (schedule) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar horario?",
      text: `${schedule.sportRoom?.sport?.name || "Clase"} - ${DIAS_SEMANA[schedule.day_of_week]}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });
    if (confirm.isConfirmed) {
      try {
        await authFetch(`/class-schedules/${schedule.id}`, { method: 'DELETE' });
        loadData();
        Swal.fire("Eliminado", "Horario borrado correctamente", "success");
      } catch (error) {
        Swal.fire("Error", error.message || "No se pudo eliminar", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.start_time >= formData.end_time) {
      Swal.fire("Error", "La hora de fin debe ser posterior a la hora de inicio", "error");
      return;
    }

    // Evitar duplicados (misma asignación el mismo día), sin contar el que se está editando
    const esDuplicado = schedules.some(s =>
      s.sport_room_id == formData.sport_room_id &&
      s.day_of_week == formData.day_of_week &&
      s.id !== editingSchedule?.id
    );
    if (esDuplicado) {
      Swal.fire("Error", "Ya existe un horario para esta asignación en ese día", "error");
      return;
    }

    try {
      if (editingSchedule) {
        await authFetch(`/class-schedules/${editingSchedule.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        Swal.fire("Éxito", "Horario actualizado correctamente", "success");
      } else {
        await authFetch('/class-schedules', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        Swal.fire("Éxito", "Horario registrado correctamente", "success");
      }
      closeModal();
      loadData();
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo guardar el horario", "error");
    }
  };

  const handleToggleStatus = async (schedule) => {
    try {
      await authFetch(`/class-schedules/${schedule.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: !schedule.status }),
      });
      loadData();
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo cambiar el estado", "error");
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <TableCard title="Gestión de Horarios" actionLabel="+ Nuevo Horario" onAction={openCreateModal}>
        <Table hover responsive className="mb-0 align-middle">
          <thead>
            <tr className="text-muted" style={{ fontSize: "0.8rem" }}>
              <th className="ps-3 py-2">Deporte</th>
              <th className="py-2">Sala</th>
              <th className="py-2">Coach</th>
              <th className="py-2">Día</th>
              <th className="py-2">Horario</th>
              <th className="py-2">Estado</th>
              <th className="pe-3 py-2 text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length > 0 ? (
              schedules.map(s => (
                <tr key={s.id}>
                  <td className="ps-3 fw-semibold">{s.sportRoom?.sport?.name || "-"}</td>
                  <td className="text-muted">{s.sportRoom?.room?.name || "-"}</td>
                  <td className="text-muted">{s.sportRoom?.coach?.full_name || s.sportRoom?.coach?.email || "-"}</td>
                  <td>
                    <span className="badge bg-light text-dark border fw-normal">{DIAS_SEMANA[s.day_of_week] || s.day_of_week}</span>
                  </td>
                  <td className="text-muted text-nowrap">{s.start_time?.substring(0, 5)} - {s.end_time?.substring(0, 5)}</td>
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
              <EmptyTableRow colSpan={7} message="No hay horarios registrados." />
            )}
          </tbody>
        </Table>
      </TableCard>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton closeVariant="white" className="text-white border-0 py-2" style={{ background: "linear-gradient(90deg, #1a1420 0%, #ff7c2a 100%)" }}>
          <Modal.Title className="fw-bold" style={{ fontSize: "1.1rem" }}>{editingSchedule ? "Editar Horario" : "Registrar Horario"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Asignación (Deporte - Sala - Coach)</Form.Label>
              <Form.Select
                size="sm"
                required
                value={formData.sport_room_id}
                onChange={(e) => setFormData({ ...formData, sport_room_id: e.target.value })}
              >
                <option value="">Seleccione asignación</option>
                {sportRooms.map(sr => (
                  <option key={sr.id} value={sr.id}>
                    {sr.sport?.name || "Deporte"} - {sr.room?.name || "Sala"} ({sr.coach?.full_name || sr.coach?.email || "Sin coach"})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Row className="g-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Día</Form.Label>
                  <Form.Select
                    size="sm"
                    required
                    value={formData.day_of_week}
                    onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                  >
                    <option value="">Seleccione</option>
                    {Object.entries(DIAS_SEMANA).map(([num, nombre]) => (
                      <option key={num} value={num}>{nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Hora Inicio</Form.Label>
                  <Form.Control
                    size="sm"
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="mb-1 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>Hora Fin</Form.Label>
                  <Form.Control
                    size="sm"
                    type="time"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 px-3 pb-3">
            <Button size="sm" variant="outline-secondary" onClick={closeModal}>Cancelar</Button>
            <Button size="sm" type="submit" className="fw-semibold border-0" style={{ backgroundColor: "#ff7c2a" }}>Guardar Horario</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Schedules;