import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import { getCoachDashboard } from "../../services/coachService";
import Swal from "sweetalert2";

const BRAND = "#4828a7";
const DIAS = { 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 7: "Domingo" };

function formatTime(t) {
  return t ? t.substring(0, 5) : "N/A";
}

// Ícono simple de mancuerna, en SVG puro (sin dependencias externas)
function DumbbellIcon({ size = 26, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5 L17.5 17.5" />
      <path d="M4 4 L7 7" />
      <path d="M17 17 L20 20" />
      <rect x="2" y="8" width="4" height="4" rx="1" transform="rotate(45 4 10)" />
      <rect x="18" y="14" width="4" height="4" rx="1" transform="rotate(45 20 16)" />
    </svg>
  );
}

function StatCard({ label, value }) {
  return (
    <Card
      className="border-0 h-100 text-white shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${BRAND} 0%, #2b2b2b 130%)`,
        borderRadius: "1rem",
      }}
    >
      <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center py-4">
        <div
          className="d-flex align-items-center justify-content-center mb-2"
          style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }}
        >
          <DumbbellIcon />
        </div>
        <h2 className="fw-bold mb-0" style={{ fontSize: "2.5rem" }}>
          {value}
        </h2>
        <small className="text-uppercase fw-semibold" style={{ letterSpacing: "1px" }}>
          {label}
        </small>
      </Card.Body>
    </Card>
  );
}

function CoachDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      // /coach/dashboard ya trae todo consolidado: total_classes, total_schedules,
      // total_rooms y next_class (ver coach.service.js -> getDashboard).
      const response = await getCoachDashboard();
      setData(response.data);
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo cargar el dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Container fluid className="py-5 text-center">
        <Spinner animation="border" style={{ color: BRAND }} />
      </Container>
    );
  }

  const nextClass = data?.next_class;
  const sportRoom = nextClass?.sportRoom;

  return (
    <Container fluid className="py-4">
      <Row className="g-3 mb-4">
        <Col md={4} sm={6}>
          <StatCard label="Mis Clases" value={data?.total_classes ?? 0} />
        </Col>
        <Col md={4} sm={6}>
          <StatCard label="Horarios Semanales" value={data?.total_schedules ?? 0} />
        </Col>
        <Col md={4} sm={6}>
          <StatCard label="Salas Asignadas" value={data?.total_rooms ?? 0} />
        </Col>
      </Row>

      <Card className="border-0 shadow-sm" style={{ borderRadius: "1rem" }}>
        <Card.Header
          className="text-white fw-bold text-uppercase py-3"
          style={{
            background: BRAND,
            borderRadius: "1rem 1rem 0 0",
            letterSpacing: "1px",
          }}
        >
          Próxima Clase
        </Card.Header>
        <Card.Body className="p-4">
          {nextClass ? (
            <Row className="align-items-center">
              <Col md={4}>
                <small className="text-muted text-uppercase fw-semibold">Deporte</small>
                <p className="fw-bold fs-5 mb-0">{sportRoom?.sport?.name || "-"}</p>
              </Col>
              <Col md={4}>
                <small className="text-muted text-uppercase fw-semibold">Sala</small>
                <p className="fw-bold fs-5 mb-0">{sportRoom?.room?.name || "-"}</p>
              </Col>
              <Col md={4}>
                <small className="text-muted text-uppercase fw-semibold">Horario</small>
                <p className="mb-0">
                  <Badge style={{ backgroundColor: BRAND }} className="fs-6">
                    {DIAS[nextClass.day_of_week]} {formatTime(nextClass.start_time)} - {formatTime(nextClass.end_time)}
                  </Badge>
                </p>
              </Col>
            </Row>
          ) : (
            <p className="text-center text-muted mb-0">
              No tienes clases programadas todavía.
            </p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CoachDashboard;