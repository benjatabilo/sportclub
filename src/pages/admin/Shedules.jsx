import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { authFetch } from "../../services/apiFetch";
import Swal from "sweetalert2";

const DIAS_SEMANA = { 
  1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 7: "Domingo" 
};

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [sportRooms, setSportRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    sport_room_id: "", 
    day_of_week: "", 
    start_time: "", 
    end_time: "", 
    status: 1 
  });

  const loadData = async () => {
    try {
      const [schedRes, srRes] = await Promise.all([
        authFetch('/class-schedules'), 
        authFetch('/sport-rooms')
      ]);
      setSchedules(schedRes.data || schedRes || []);
      setSportRooms(srRes.data || srRes || []);
    } catch (error) { 
      Swal.fire("Error", "No se pudieron cargar los datos", "error"); 
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({ 
      title: "¿Eliminar?", text: "Esta acción no se puede deshacer", icon: "warning", showCancelButton: true 
    });
    if (confirm.isConfirmed) {
      try {
        await authFetch(`/class-schedules/${id}`, { method: 'DELETE' });
        loadData();
        Swal.fire("Eliminado", "Horario borrado correctamente", "success");
      } catch (error) { Swal.fire("Error", "No se pudo eliminar", "error"); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación 1: Hora fin posterior a hora inicio
    if (formData.start_time >= formData.end_time) {
      Swal.fire("Error", "La hora de fin debe ser posterior a la hora de inicio", "error");
      return;
    }

    // Validación 2: Evitar duplicados (misma asignación el mismo día)
    const esDuplicado = schedules.some(s => 
      s.sport_room_id == formData.sport_room_id && 
      s.day_of_week == formData.day_of_week
    );

    if (esDuplicado) {
      Swal.fire("Error", "Ya existe un horario para esta asignación en ese día", "error");
      return;
    }

    try {
      await authFetch('/class-schedules', { 
        method: 'POST', 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData) 
      });
      Swal.fire("Éxito", "Horario registrado correctamente", "success");
      setShowModal(false);
      loadData();
    } catch (error) { 
      Swal.fire("Error", "No se pudo guardar el horario", "error"); 
    }
  };

  return (
    <Container className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h3>Gestión de Horarios</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>+ Nuevo Horario</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Día</th><th>Inicio</th><th>Fin</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(s => (
            <tr key={s.id}>
              <td>{DIAS_SEMANA[s.day_of_week] || s.day_of_week}</td>
              <td>{s.start_time}</td>
              <td>{s.end_time}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Registrar Horario</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Asignación (ID)</Form.Label>
              <Form.Select required onChange={(e) => setFormData({...formData, sport_room_id: e.target.value})}>
                <option value="">Seleccione asignación</option>
                {sportRooms.map(sr => <option key={sr.id} value={sr.id}>Asignación ID: {sr.id}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Día de la semana</Form.Label>
              <Form.Select required onChange={(e) => setFormData({...formData, day_of_week: e.target.value})}>
                <option value="">Seleccione día</option>
                {Object.entries(DIAS_SEMANA).map(([num, nombre]) => (
                  <option key={num} value={num}>{nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Horarios</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control type="time" required onChange={(e) => setFormData({...formData, start_time: e.target.value})} />
                <Form.Control type="time" required onChange={(e) => setFormData({...formData, end_time: e.target.value})} />
              </div>
            </Form.Group>
            <Button type="submit" className="w-100">Guardar Horario</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Schedules;