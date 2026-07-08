import { useState, useEffect } from "react";
import { Container, Table, Spinner, Badge } from "react-bootstrap";
import { getMySchedules } from "../../services/coachService";
import Swal from "sweetalert2";

// El backend usa day_of_week de 1 a 7 (1=Lunes ... 7=Domingo), ver
// classSchedule.validator.js. No es el 0=Domingo de JS Date.getDay().
const DAYS = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

/**
 * Alias reales definidos en src/models/index.js del backend:
 *   ClassSchedule.belongsTo(SportRoom, { as: "sportRoom" })
 *   SportRoom.belongsTo(Sport, { as: "sport" })
 *   SportRoom.belongsTo(Room,  { as: "room" })
 * Confirmado también en src/repositories/coach.repository.js (findMySchedules).
 */
function getSportName(schedule) {
  return schedule.sportRoom?.sport?.name || null;
}

function getRoomName(schedule) {
  return schedule.sportRoom?.room?.name || null;
}

function CoachSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDayName = (dayNumber) => DAYS[dayNumber] || "Día desconocido";

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const response = await getMySchedules();
      const list = response.data || [];
      setSchedules(Array.isArray(list) ? list : []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar tus horarios", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  return (
    <Container className="p-4">
      <h3 className="mb-4">Mi Horario de Clases</h3>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped hover responsive className="bg-white shadow-sm rounded">
          <thead className="table-light">
            <tr>
              <th>Día</th>
              <th>Horario</th>
              <th>Clase</th>
              <th>Sala/Espacio</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length > 0 ? (
              schedules.map((s) => (
                <tr key={s.id}>
                  <td className="align-middle fw-bold">{getDayName(s.day_of_week)}</td>
                  <td className="align-middle">
                    <Badge bg="secondary">
                      {s.start_time?.substring(0, 5)} - {s.end_time?.substring(0, 5)}
                    </Badge>
                  </td>
                  <td className="align-middle">{getSportName(s) || "Sin nombre"}</td>
                  <td className="align-middle">{getRoomName(s) || "Sin asignar"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No tienes horarios registrados actualmente.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default CoachSchedule;