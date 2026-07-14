import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { getMemberDashboard } from "../../services/memberService";
import { getMyReservations } from "../../services/Reservationservice";
import ScheduleBadge from "../../components/ScheduleBadge";
import PageLoader from "../../components/PageLoader";
import EmptyTableRow from "../../components/EmptyTableRow";
import MotivationalBackground from "../../components/MotivationalBackground";
import Swal from "sweetalert2";

const BRAND = "#006b71";
const DIAS_ORDEN = [1, 2, 3, 4, 5, 6, 7];
const DIAS_LABEL = { 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 7: "Domingo" };

function formatTime(t) {
  return t ? t.substring(0, 5) : "N/A";
}

// Agrupa las reservas activas del usuario por día de la semana, para
// pintar "mi calendario" (lo que él reservó, no el catálogo general).
function buildWeekMapFromReservations(reservas) {
  const map = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
  reservas
    .filter((r) => r.status === "active" && r.classSchedule)
    .forEach((r) => {
      const day = r.classSchedule.day_of_week;
      if (map[day]) {
        map[day].push({
          id: r.id,
          time: formatTime(r.classSchedule.start_time),
          sportName: r.classSchedule.sportRoom?.sport?.name || "Clase",
        });
      }
    });
  return map;
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
  const [reservas, setReservas] = useState([]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashboardRes, reservasRes] = await Promise.all([
        getMemberDashboard(),
        getMyReservations(),
      ]);

      setDashboard(dashboardRes.data);
      setReservas(reservasRes.data || []);
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
    return <PageLoader color={BRAND} fluid />;
  }

  const nextClasses = dashboard?.next_classes || [];
  const misReservasActivas = reservas.filter((r) => r.status === "active").length;
  const weekMap = buildWeekMapFromReservations(reservas);

  return (
    <MotivationalBackground>
      <Container fluid className="py-4">
        <Row className="g-3 mb-4 justify-content-center">
          <Col md={4} sm={6}>
            <StatCard label="Mis Reservas Activas" value={misReservasActivas} />
          </Col>
          <Col md={4} sm={6}>
            <StatCard label="Horarios Disponibles" value={dashboard?.available_schedules ?? 0} />
          </Col>
        </Row>

        <Row className="g-3">
          {/* Calendario semanal: lo que el usuario tiene reservado */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: "1rem" }}>
              <Card.Header
                className="text-white fw-bold text-uppercase py-3"
                style={{
                  background: BRAND,
                  borderRadius: "1rem 1rem 0 0",
                  letterSpacing: "1px",
                }}
              >
                Mi Calendario de Reservas
              </Card.Header>
              <Card.Body className="p-3">
                {DIAS_ORDEN.map((dia) => (
                  <div key={dia} className="d-flex align-items-start py-2 border-bottom">
                    <div
                      className="fw-semibold flex-shrink-0"
                      style={{ width: 90, fontSize: "0.85rem", color: BRAND }}
                    >
                      {DIAS_LABEL[dia]}
                    </div>
                    <div className="flex-grow-1">
                      {weekMap[dia].length > 0 ? (
                        weekMap[dia].map((s) => (
                          <span
                            key={s.id}
                            className="badge me-1 mb-1"
                            style={{ backgroundColor: BRAND, fontWeight: 500 }}
                          >
                            {s.time} {s.sportName}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted" style={{ fontSize: "0.82rem" }}>Sin reservas</span>
                      )}
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Tabla de próximas clases */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: "1rem" }}>
              <Card.Header
                className="text-white fw-bold text-uppercase py-3"
                style={{
                  background: BRAND,
                  borderRadius: "1rem 1rem 0 0",
                  letterSpacing: "1px",
                }}
              >
                Clases Disponibles para Reservar
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
                                <ScheduleBadge
                                  key={s.id}
                                  dayOfWeek={s.day_of_week}
                                  startTime={s.start_time}
                                  showEndTime={false}
                                  style={{ backgroundColor: BRAND }}
                                  className="me-1"
                                />
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
                      <EmptyTableRow colSpan={4} message="No hay clases disponibles por el momento." />
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </MotivationalBackground>
  );
}

export default UserDashboard;