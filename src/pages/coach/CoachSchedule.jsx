import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { getMySchedules } from "../../services/Coachservice";
import { DIAS_SEMANA } from "../../components/ScheduleBadge";
import PageLoader from "../../components/PageLoader";
import EmptyTableRow from "../../components/EmptyTableRow";
import TableCard from "../../components/TableCard";
import Swal from "sweetalert2";

const BRAND = "#4828a7";

function formatTime(t) {
  return t ? t.substring(0, 5) : "N/A";
}

function CoachSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <PageLoader />;
  }

  return (
    <TableCard title="Mi Horario de Clases" color={BRAND}>
      <Table hover responsive className="mb-0 align-middle">
        <thead>
          <tr className="text-muted" style={{ fontSize: "0.8rem" }}>
            <th className="ps-3 py-3">Día</th>
            <th className="py-3">Horario</th>
            <th className="py-3">Clase</th>
            <th className="pe-3 py-3">Sala/Espacio</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length > 0 ? (
            schedules.map((s) => {
              const sport = s.sportRoom?.sport;
              const room = s.sportRoom?.room;
              return (
                <tr key={s.id}>
                  <td className="ps-3">
                    <span className="badge bg-light text-dark border fw-normal">
                      {DIAS_SEMANA[s.day_of_week] || "Día desconocido"}
                    </span>
                  </td>
                  <td className="text-muted text-nowrap">{formatTime(s.start_time)} - {formatTime(s.end_time)}</td>
                  <td>
                    <div className="fw-semibold">
                      {sport?.name || "Sin nombre"}
                      {sport?.duration ? ` (${sport.duration} min)` : ""}
                    </div>
                    {sport?.objective && (
                      <div className="text-muted" style={{ fontSize: "0.82rem" }}>{sport.objective}</div>
                    )}
                  </td>
                  <td className="pe-3">
                    <div>{room?.name || "Sin asignar"}</div>
                    <div className="text-muted" style={{ fontSize: "0.82rem" }}>
                      {room?.location}
                      {room?.capacity ? ` · Capacidad: ${room.capacity}` : ""}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <EmptyTableRow colSpan={4} message="No tienes horarios registrados actualmente." />
          )}
        </tbody>
      </Table>
    </TableCard>
  );
}

export default CoachSchedule;