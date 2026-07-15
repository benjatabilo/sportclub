import { useState, useEffect } from "react";
import { Container, Table, Card } from "react-bootstrap";
import { getMyClasses } from "../../services/coachService";
import { DIAS_SEMANA, formatTime } from "../../components/ScheduleBadge";
import StatusBadge from "../../components/StatusBadge";
import PageLoader from "../../components/PageLoader";
import EmptyTableRow from "../../components/EmptyTableRow";
import Swal from "sweetalert2";

const BRAND = "#4828a7";

function CoachClass() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadClases = async () => {
    try {
      setLoading(true);
      // /coach/my-classes devuelve asignaciones (SportRoom), cada una con
      // su deporte, su sala y un arreglo "schedules" con todos sus horarios.
      const response = await getMyClasses();
      setClases(response.data || []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar tus clases", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClases();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4" style={{ color: BRAND }}>Mis Clases Asignadas</h4>
      {clases.length > 0 ? (
        clases.map((clase) => (
          <Card
            key={clase.id}
            className="mb-3 border-0 shadow-sm"
            style={{ borderRadius: "0.9rem", borderLeft: `4px solid ${BRAND}` }}
          >
            <Card.Body>
              <div className="position-relative mb-1">
                <div className="position-absolute top-0 end-0">
                  <StatusBadge active={clase.status} activeLabel="Activa" inactiveLabel="Inactiva" />
                </div>
                <div className="text-center">
                  <Card.Title className="mb-1 fw-bold">
                    {clase.sport?.name || "Sin deporte"}
                  </Card.Title>
                  <Card.Subtitle className="text-muted" style={{ fontSize: "0.85rem" }}>
                    Sala: {clase.room?.name || "Sin asignar"}
                    {clase.room?.location ? ` · ${clase.room.location}` : ""}
                    {clase.room?.capacity ? ` · Capacidad: ${clase.room.capacity}` : ""}
                  </Card.Subtitle>
                </div>
              </div>

              {clase.sport?.objective && (
                <p className="mb-1 text-muted" style={{ fontSize: "0.88rem" }}>
                  {clase.sport.objective}
                  {clase.sport?.duration ? ` · Duración: ${clase.sport.duration} min` : ""}
                </p>
              )}

              {clase.room?.description && (
                <p className="mb-1 text-muted" style={{ fontSize: "0.85rem" }}>
                  <strong>Sobre la sala:</strong> {clase.room.description}
                </p>
              )}

              {clase.observation && (
                <p className="mb-2 text-muted" style={{ fontSize: "0.85rem" }}>
                  <strong>Observación:</strong> {clase.observation}
                </p>
              )}

              <Table size="sm" hover responsive className="mb-0 mt-2">
                <thead>
                  <tr className="text-muted" style={{ fontSize: "0.78rem" }}>
                    <th>Día</th>
                    <th>Horario</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {clase.schedules && clase.schedules.length > 0 ? (
                    clase.schedules.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <span className="badge bg-light text-dark border fw-normal">
                            {DIAS_SEMANA[s.day_of_week] || "Día desconocido"}
                          </span>
                        </td>
                        <td className="text-muted text-nowrap">{formatTime(s.start_time)} - {formatTime(s.end_time)}</td>
                        <td>
                          <StatusBadge active={s.status} activeLabel="Activo" inactiveLabel="Inactivo" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <EmptyTableRow colSpan={3} message="Esta clase todavía no tiene horarios asignados." />
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted">
          No tienes clases asignadas actualmente.
        </p>
      )}
    </Container>
  );
}

export default CoachClass;