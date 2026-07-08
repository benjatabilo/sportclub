import { useState, useEffect } from "react";
import { Container, Table, Button, Spinner, Badge } from "react-bootstrap";
import { getMyReservations, cancelReservation } from "../../services/reservationService";
import Swal from "sweetalert2";

/**
 * GET /reservations/my-reservations devuelve, para cada reserva:
 *   r.classSchedule.day_of_week / start_time / end_time
 *   r.classSchedule.sportRoom.sport.name
 *   r.classSchedule.sportRoom.room.name
 *   r.classSchedule.sportRoom.coach.email
 * (ver reservation.repository.js -> findAll/findById includes)
 */
function getClaseInfo(reserva) {
  const sportRoom = reserva.classSchedule?.sportRoom;
  const sport = sportRoom?.sport?.name || "Deporte";
  const room = sportRoom?.room?.name || "Sala";
  const coachEmail = sportRoom?.coach?.email;
  return coachEmail ? `${sport} - ${room} (Coach: ${coachEmail})` : `${sport} - ${room}`;
}

function UserReserve() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleCancelar = async (id) => {
    const result = await Swal.fire({
      title: "¿Cancelar reserva?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar",
    });

    if (result.isConfirmed) {
      try {
        // El backend no tiene DELETE /reservations/:id, solo
        // PATCH /reservations/:id/cancel (ver reservation.routes.js).
        await cancelReservation(id);
        Swal.fire("Cancelada", "Tu reserva ha sido cancelada", "success");
        loadData();
      } catch (error) {
        Swal.fire("Error", error.message || "No se pudo cancelar la reserva", "error");
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
          {reservas.length > 0 ? (
            reservas.map((r) => (
              <tr key={r.id}>
                <td className="align-middle">{getClaseInfo(r)}</td>
                <td className="align-middle">
                  <Badge bg={r.status === "active" ? "success" : "secondary"}>
                    {r.status}
                  </Badge>
                </td>
                <td className="align-middle">
                  {r.status === "active" && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCancelar(r.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No tienes reservas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default UserReserve;