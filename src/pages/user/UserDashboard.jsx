import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Badge } from "react-bootstrap";
import { getMemberDashboard } from "../../services/memberService";
import { getMyReservations } from "../../services/reservationService";
import Swal from "sweetalert2";

const BRAND = "#006b71";
const DIAS = { 1: "Lun", 2: "Mar", 3: "Mié", 4: "Jue", 5: "Vie", 6: "Sáb", 7: "Dom" };

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

function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [misReservasActivas, setMisReservasActivas] = useState(0);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      // /member/dashboard ya trae todo consolidado: available_classes,
      // available_sports, available_rooms, available_schedules y next_classes
      // (ver member.service.js -> getDashboard).
      const [dashboardRes, reservasRes] = await Promise.all([
        getMemberDashboard(),
        getMyReservations(),
      ]);

      setDashboard(dashboardRes.data);
      const reservas = reservasRes.data || [];
      setMisReservasActivas(reservas.filter((r) => r.status === "active").length);
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

  const nextClasses = dashboard?.next_classes || [];

  return (
    <Container fluid className="py-4">
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <StatCard label="Clases Disponibles" value={dashboard?.available_classes ?? 0} />
        </Col>
        <Col md={3} sm={6}>
          <StatCard label="Horarios Disponibles" value={dashboard?.available_schedules ?? 0} />
        </Col>
        <Col md={3} sm={6}>
          <StatCard label="Salas" value={dashboard?.available_rooms ?? 0} />
        </Col>
        <Col md={3} sm={6}>
          <StatCard label="Mis Reservas Activas" value={misReservasActivas} />
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
          Próximas Clases Disponibles
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead>
              <tr className="text-muted">
                <th className="ps-3">Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Horarios</th>
              </tr>
            </thead>
            <tbody>
              {nextClasses.length > 0 ? (
                nextClasses.map((c) => (
                  <tr key={c.id}>
                    <td className="ps-3 fw-semibold">{c.sport?.name || "-"}</td>
                    <td>{c.room?.name || "-"}</td>
                    <td>{c.coach?.full_name || c.coach?.email || "-"}</td>
                    <td>
                      {c.schedules && c.schedules.length > 0 ? (
                        c.schedules.slice(0, 2).map((s) => (
                          <Badge key={s.id} className="me-1" style={{ backgroundColor: BRAND }}>
                            {DIAS[s.day_of_week]} {formatTime(s.start_time)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted">Sin horario</span>
                      )}
                      {c.schedules && c.schedules.length > 2 && (
                        <span className="text-muted small">+{c.schedules.length - 2}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    No hay clases disponibles por el momento.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UserDashboard;