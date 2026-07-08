import { useState, useEffect } from "react";
import { Container, Table, Badge, Spinner, Card } from "react-bootstrap";
import { getMyClasses } from "../../services/coachService";
import Swal from "sweetalert2";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function formatTime(t) {
  return t ? t.substring(0, 5) : "N/A";
}

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

  return (
    <Container className="p-4">
      <h3 className="mb-4">Mis Clases Asignadas</h3>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : clases.length > 0 ? (
        clases.map((clase) => (
          <Card key={clase.id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start flex-wrap">
                <div>
                  <Card.Title className="mb-1">
                    {clase.sport?.name || "Sin deporte"}
                  </Card.Title>
                  <Card.Subtitle className="text-muted mb-2">
                    Sala: {clase.room?.name || "Sin asignar"}
                    {clase.room?.location ? ` · ${clase.room.location}` : ""}
                  </Card.Subtitle>
                </div>
                <Badge bg={clase.status ? "success" : "secondary"}>
                  {clase.status ? "Activa" : "Inactiva"}
                </Badge>
              </div>

              {clase.sport?.objective && (
                <p className="mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
                  {clase.sport.objective}
                </p>
              )}

              <Table size="sm" striped responsive className="mb-0 mt-2">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Horario</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {clase.schedules && clase.schedules.length > 0 ? (
                    clase.schedules.map((s) => (
                      <tr key={s.id}>
                        <td>{DAYS[s.day_of_week] || "Día desconocido"}</td>
                        <td>
                          {formatTime(s.start_time)} - {formatTime(s.end_time)}
                        </td>
                        <td>
                          <Badge bg={s.status ? "success" : "secondary"}>
                            {s.status ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        Esta clase todavía no tiene horarios asignados.
                      </td>
                    </tr>
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