import { useState, useEffect } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import { authFetch } from "../../services/apiFetch";
import Swal from "sweetalert2";

const DIAS = { 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 7: "Domingo" };

function UserClass() {
  const [loading, setLoading] = useState(true);
  const [clases, setClases] = useState([]);
  const [dataMaestra, setDataMaestra] = useState({ rooms: [], sports: [], coaches: [], sportRooms: [] });

  const loadData = async () => {
    try {
      setLoading(true);
      const [schedules, sRooms, sList, rList, uList] = await Promise.all([
        authFetch('/class-schedules'), //
        authFetch('/sport-rooms'),     //
        authFetch('/sports'),          //
        authFetch('/rooms'),           //[cite: 2]
        authFetch('/users')            //[cite: 2]
      ]);

      setClases(schedules.data || schedules || []);
      setDataMaestra({
        sportRooms: sRooms.data || sRooms || [],
        sports: sList.data || sList || [],
        rooms: rList.data || rList || [],
        coaches: (uList.data || uList || []).filter(u => u.role === 'coach')
      });
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las clases", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getDetalleClase = (sportRoomId) => {
    const sr = dataMaestra.sportRooms.find(a => a.id == sportRoomId);
    if (!sr) return "Cargando...";

    const sport = dataMaestra.sports.find(s => s.id == sr.sport_id)?.name || "Deporte";
    const room = dataMaestra.rooms.find(r => r.id == sr.room_id)?.name || "Sala";
    const coach = dataMaestra.coaches.find(c => c.id == sr.coach_id)?.full_name || "Sin coach";

    return `${sport} en ${room} (Coach: ${coach})`;
  };

  const handleReservar = async (claseId) => {
    const result = await Swal.fire({
      title: '¿Confirmar reserva?',
      text: "Se registrará tu cupo en esta clase.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reservar'
    });

    if (result.isConfirmed) {
      try {
        await authFetch('/reservations', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ class_schedule_id: claseId }) //[cite: 2]
        });
        Swal.fire("¡Éxito!", "Reserva realizada", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo realizar la reserva", "error");
      }
    }
  };

  if (loading) return <Container className="p-4 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="p-4">
      <h3 className="mb-4">Clases Disponibles</h3>
      <Table striped hover responsive className="bg-white shadow-sm rounded">
        <thead className="table-light">
          <tr>
            <th>Día</th>
            <th>Horario</th>
            <th>Información de la Clase</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {clases.map(c => (
            <tr key={c.id}>
              <td className="align-middle">{DIAS[c.day_of_week]}</td>
              <td className="align-middle">{c.start_time} - {c.end_time}</td>
              <td className="align-middle">{getDetalleClase(c.sport_room_id)}</td>
              <td className="align-middle">
                <Button variant="primary" size="sm" onClick={() => handleReservar(c.id)}>Reservar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default UserClass;