import { useState, useEffect } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import { getAvailableClasses } from "../../services/memberService";
import { createReservation } from "../../services/reservationService";
import Swal from "sweetalert2";

const DIAS = { 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 7: "Domingo" };

function formatTime(t) {
  return t ? t.substring(0, 5) : "N/A";
}

/**
 * GET /member/classes devuelve asignaciones (SportRoom) con sport, room, coach
 * y un arreglo "schedules" (ver member.repository.js -> findAvailableClasses).
 * Aquí las "aplanamos" a una fila por horario, que es lo que el usuario
 * realmente reserva (class_schedule_id).
 */
function flattenSchedules(sportRooms) {
  const rows = [];
  sportRooms.forEach((sr) => {
    (sr.schedules || []).forEach((schedule) => {
      rows.push({
        scheduleId: schedule.id,
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        sportName: sr.sport?.name || "Deporte",
        roomName: sr.room?.name || "Sala",
        coachEmail: sr.coach?.email,
      });
    });
  });
  return rows;
}

function UserClass() {
  const [loading, setLoading] = useState(true);
  const [clases, setClases] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getAvailableClasses();
      setClases(flattenSchedules(response.data || []));
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las clases", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReservar = async (scheduleId) => {
    const result = await Swal.fire({
      title: "¿Confirmar reserva?",
      text: "Se registrará tu cupo en esta clase.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reservar",
    });

    if (result.isConfirmed) {
      try {
        await createReservation(scheduleId);
        Swal.fire("¡Éxito!", "Reserva realizada", "success");
      } catch (error) {
        Swal.fire("Error", error.message || "No se pudo realizar la reserva", "error");
      }
    }
  };

  if (loading) {
    return (
      <Container className="p-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

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
          {clases.length > 0 ? (
            clases.map((c) => (
              <tr key={c.scheduleId}>
                <td className="align-middle">{DIAS[c.day_of_week] || "N/A"}</td>
                <td className="align-middle">
                  {formatTime(c.start_time)} - {formatTime(c.end_time)}
                </td>
                <td className="align-middle">
                  {c.sportName} en {c.roomName}
                  {c.coachEmail ? ` (Coach: ${c.coachEmail})` : ""}
                </td>
                <td className="align-middle">
                  <Button variant="primary" size="sm" onClick={() => handleReservar(c.scheduleId)}>
                    Reservar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No hay clases disponibles por el momento.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default UserClass;