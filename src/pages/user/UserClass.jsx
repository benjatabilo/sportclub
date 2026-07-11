import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { getAvailableClasses } from "../../services/memberService";
import { createReservation } from "../../services/reservationService";
import { DIAS_SEMANA, formatTime } from "../../components/ScheduleBadge";
import PageLoader from "../../components/PageLoader";
import EmptyTableRow from "../../components/EmptyTableRow";
import TableCard from "../../components/TableCard";
import { IconButton } from "../../components/ActionButtons";
import { CalendarCheckIcon } from "../../components/icons";
import MotivationalBackground from "../../components/MotivationalBackground";
import Swal from "sweetalert2";

const BRAND = "#006b71";

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
        sportObjective: sr.sport?.objective,
        sportDuration: sr.sport?.duration,
        roomName: sr.room?.name || "Sala",
        roomLocation: sr.room?.location,
        roomCapacity: sr.room?.capacity,
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
    return <PageLoader />;
  }

  return (
    <MotivationalBackground>
      <TableCard title="Clases Disponibles" color={BRAND}>
        <Table hover responsive className="mb-0 align-middle">
          <thead>
            <tr className="text-muted" style={{ fontSize: "0.8rem" }}>
              <th className="ps-3 py-3">Día</th>
              <th className="py-3">Horario</th>
              <th className="py-3">Clase</th>
              <th className="pe-3 py-3 text-end">Acción</th>
            </tr>
          </thead>
          <tbody>
            {clases.length > 0 ? (
              clases.map((c) => (
                <tr key={c.scheduleId}>
                  <td className="ps-3">
                    <span className="badge bg-light text-dark border fw-normal">
                      {DIAS_SEMANA[c.day_of_week] || "N/A"}
                    </span>
                  </td>
                  <td className="text-muted text-nowrap">
                    {formatTime(c.start_time)} - {formatTime(c.end_time)}
                  </td>
                  <td>
                    <div className="fw-semibold">
                      {c.sportName} en {c.roomName}
                      {c.sportDuration ? ` (${c.sportDuration} min)` : ""}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.82rem" }}>
                      {c.sportObjective}
                      {c.roomCapacity ? ` · Capacidad: ${c.roomCapacity}` : ""}
                      {c.roomLocation ? ` · ${c.roomLocation}` : ""}
                      {c.coachEmail ? ` · Coach: ${c.coachEmail}` : ""}
                    </div>
                  </td>
                  <td className="pe-3">
                    <div className="d-flex justify-content-end">
                      <IconButton
                        label="Reservar"
                        variant="outline-primary"
                        onClick={() => handleReservar(c.scheduleId)}
                      >
                        <CalendarCheckIcon />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <EmptyTableRow colSpan={4} message="No hay clases disponibles por el momento." />
            )}
          </tbody>
        </Table>
      </TableCard>
    </MotivationalBackground>
  );
}

export default UserClass;