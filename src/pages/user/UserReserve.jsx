import { useState, useEffect } from "react";
import { Container, Table, Button, Spinner, Badge } from "react-bootstrap";
import { authFetch } from "../../services/apiFetch";
import Swal from "sweetalert2";

function UserReserve() {
  const [reservas, setReservas] = useState([]);
  const [dataMaestra, setDataMaestra] = useState({ rooms: [], sports: [], coaches: [], sportRooms: [], schedules: [] });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [res, sRooms, sList, rList, uList, schedules] = await Promise.all([
        authFetch('/reservations'),
        authFetch('/sport-rooms'),
        authFetch('/sports'),
        authFetch('/rooms'),
        authFetch('/users'),
        authFetch('/class-schedules')
      ]);

      setReservas(res.data || res || []);
      setDataMaestra({
        sportRooms: sRooms.data || sRooms || [],
        sports: sList.data || sList || [],
        rooms: rList.data || rList || [],
        coaches: (uList.data || uList || []).filter(u => u.role === 'coach'),
        schedules: schedules.data || schedules || []
      });
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar tus reservas", "error");
    } finally {
      setLoading(false);
    }
  };

  const getDetalleReserva = (classScheduleId) => {
    const schedule = dataMaestra.schedules.find(s => s.id == classScheduleId);
    if (!schedule) return "Detalle no disponible";

    const sr = dataMaestra.sportRooms.find(a => a.id == schedule.sport_room_id);
    if (!sr) return "Información no encontrada";

    const sport = dataMaestra.sports.find(s => s.id == sr.sport_id)?.name || "Deporte";
    const room = dataMaestra.rooms.find(r => r.id == sr.room_id)?.name || "Sala";
    const coach = dataMaestra.coaches.find(c => c.id == sr.coach_id)?.full_name || "Sin coach";

    return `${sport} - ${room} (Coach: ${coach})`;
  };

  const handleCancelar = async (id) => {
    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar'
    });

    if (result.isConfirmed) {
      try {
        await authFetch(`/reservations/${id}`, { method: 'DELETE' });
        Swal.fire("Cancelada", "Tu reserva ha sido eliminada", "success");
        loadData(); // Recargamos para actualizar la vista
      } catch (error) {
        Swal.fire("Error", "No se pudo cancelar la reserva", "error");
      }
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <Container className="p-4 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="p-4">
      <h3 className="mb-4">Mis Reservas</h3>
      <Table striped hover responsive className="bg-white shadow-sm rounded">
        <thead className="table-light">
          <tr>
            <th>Clase</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(r => (
            <tr key={r.id}>
              <td className="align-middle">{getDetalleReserva(r.class_schedule_id)}</td>
              <td className="align-middle">
                <Badge bg={r.status === 'active' ? 'success' : 'secondary'}>{r.status}</Badge>
              </td>
              <td className="align-middle">
                <Button variant="outline-danger" size="sm" onClick={() => handleCancelar(r.id)}>
                  Cancelar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default UserReserve;