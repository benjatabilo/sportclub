import { useState, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";
import { getMyReservations, cancelReservation } from "../../services/reservationService";
import StatusBadge from "../../components/StatusBadge";
import ScheduleBadge from "../../components/ScheduleBadge";
import PageLoader from "../../components/PageLoader";
import EmptyTableRow from "../../components/EmptyTableRow";
import TableCard from "../../components/TableCard";
import { IconButton } from "../../components/ActionButtons";
import { XCircleIcon } from "../../components/icons";
import MotivationalBackground from "../../components/MotivationalBackground";
import Swal from "sweetalert2";

const BRAND = "#006b71";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * GET /reservations/my-reservations devuelve, para cada reserva:
 *   r.classSchedule.day_of_week / start_time / end_time
 *   r.classSchedule.sportRoom.sport.name
 *   r.classSchedule.sportRoom.room.name
 *   r.classSchedule.sportRoom.coach.email
 * (ver reservation.repository.js -> findAll/findById includes)
 *
 * El backend solo expone email del coach en este endpoint (no full_name),
 * así que la columna "Coach" muestra el correo.
 */
function getClaseNombre(reserva) {
  const sportRoom = reserva.classSchedule?.sportRoom;
  const sport = sportRoom?.sport?.name || "Deporte";
  const room = sportRoom?.room?.name || "Sala";
  return `${sport} - ${room}`;
}

function getCoachEmail(reserva) {
  return reserva.classSchedule?.sportRoom?.coach?.email || "Sin asignar";
}

function UserReserve() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      // Antes se pedía /reservations (TODAS las reservas de TODOS los usuarios).
      // Debe ser /reservations/my-reservations para traer solo las del usuario logueado.
      const response = await getMyReservations();
      setReservas(response.data || []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar tus reservas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelar = async (reserva) => {
    // Validación: no permitir cancelar algo que ya no está activo
    // (por si el estado quedó desactualizado en pantalla).
    if (reserva.status !== "active") {
      Swal.fire("Aviso", "Esta reserva ya no está activa", "info");
      return;
    }

    const result = await Swal.fire({
      title: "¿Cancelar reserva?",
      text: `${getClaseNombre(reserva)} — esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar",
    });

    if (!result.isConfirmed) return;

    setCancelingId(reserva.id);
    try {
      // El backend no tiene DELETE /reservations/:id, solo
      // PATCH /reservations/:id/cancel (ver reservation.routes.js).
      await cancelReservation(reserva.id);
      Swal.fire("Cancelada", "Tu reserva ha sido cancelada", "success");
      loadData();
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo cancelar la reserva", "error");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <MotivationalBackground>
      <TableCard title="Mis Reservas" color={BRAND}>
        <Table hover responsive className="mb-0 align-middle">
          <thead>
            <tr className="text-muted" style={{ fontSize: "0.8rem" }}>
              <th className="ps-3 py-3">Clase</th>
              <th className="py-3">Horario</th>
              <th className="py-3">Coach</th>
              <th className="py-3">Reservada el</th>
              <th className="py-3">Estado</th>
              <th className="pe-3 py-3 text-end">Acción</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length > 0 ? (
              reservas.map((r) => (
                <tr key={r.id}>
                  <td className="ps-3">
                    <div className="fw-semibold">{getClaseNombre(r)}</div>
                    {r.observation && (
                      <div className="text-muted" style={{ fontSize: "0.8rem" }}>{r.observation}</div>
                    )}
                  </td>
                  <td>
                    {r.classSchedule ? (
                      <ScheduleBadge
                        dayOfWeek={r.classSchedule.day_of_week}
                        startTime={r.classSchedule.start_time}
                        endTime={r.classSchedule.end_time}
                      />
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="text-muted">{getCoachEmail(r)}</td>
                  <td className="text-muted">{formatDate(r.created_at)}</td>
                  <td>
                    <StatusBadge active={r.status === "active"} activeLabel="Activa" inactiveLabel="Cancelada" />
                  </td>
                  <td className="pe-3">
                    {r.status === "active" && (
                      <div className="d-flex justify-content-end">
                        {cancelingId === r.id ? (
                          <Spinner size="sm" animation="border" variant="danger" />
                        ) : (
                          <IconButton
                            label="Cancelar"
                            variant="outline-danger"
                            onClick={() => handleCancelar(r)}
                          >
                            <XCircleIcon />
                          </IconButton>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <EmptyTableRow colSpan={6} message="No tienes reservas registradas." />
            )}
          </tbody>
        </Table>
      </TableCard>
    </MotivationalBackground>
  );
}

export default UserReserve;