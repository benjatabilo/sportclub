import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { getUsers } from "../../services/userService";
import { getRooms } from "../../services/roomService";
import { getSports } from "../../services/Sportservice";
import { getClassSchedules } from "../../services/ClassscheduleService";
import ScheduleBadge from "../../components/ScheduleBadge";
import StatusBadge from "../../components/StatusBadge";
import PageLoader from "../../components/PageLoader";
import EmptyTableRow from "../../components/EmptyTableRow";
import Swal from "sweetalert2";

const BRAND = "#ff7c2a";

// Fetch directo para /sport-rooms, sin depender de un service aparte
// (mismo patrón explícito que el resto de los servicios del proyecto).
async function getSportRoomsInline() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3000/api/sport-rooms", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las asignaciones");
  }
  return data;
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

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, classesWeek: 0, rooms: 0, sports: 0 });
  const [ultimasAsignaciones, setUltimasAsignaciones] = useState([]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [usersRes, roomsRes, sportsRes, schedulesRes, sportRoomsRes] = await Promise.all([
        getUsers(),
        getRooms(),
        getSports(),
        getClassSchedules(),
        getSportRoomsInline(),
      ]);

      const users = usersRes.data || [];
      const rooms = roomsRes.data || [];
      const sports = sportsRes.data || [];
      const schedules = schedulesRes.data || [];
      const sportRooms = sportRoomsRes.data || [];

      setStats({
        users: users.length,
        classesWeek: schedules.length,
        rooms: rooms.length,
        sports: sports.length,
      });

      // El backend ya devuelve /sport-rooms ordenado por created_at DESC,
      // así que los primeros 5 son las asignaciones más recientes.
      setUltimasAsignaciones(sportRooms.slice(0, 5));
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

  return (
    <Container fluid className="py-4">
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <StatCard label="Usuarios" value={stats.users} />
        </Col>
        <Col md={3} sm={6}>
          <StatCard label="Clases en la semana" value={stats.classesWeek} />
        </Col>
        <Col md={3} sm={6}>
          <StatCard label="Salas" value={stats.rooms} />
        </Col>
        <Col md={3} sm={6}>
          <StatCard label="Deportes" value={stats.sports} />
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
          Últimas Asignaciones
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead>
              <tr className="text-muted">
                <th className="ps-3">Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Horarios</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ultimasAsignaciones.length > 0 ? (
                ultimasAsignaciones.map((a) => (
                  <tr key={a.id}>
                    <td className="ps-3 fw-semibold">{a.sport?.name || "-"}</td>
                    <td>{a.room?.name || "-"}</td>
                    <td>{a.coach?.full_name || a.coach?.email || "-"}</td>
                    <td>
                      {a.schedules && a.schedules.length > 0 ? (
                        a.schedules.slice(0, 2).map((s) => (
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
                      {a.schedules && a.schedules.length > 2 && (
                        <span className="text-muted small">+{a.schedules.length - 2}</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge active={a.status} activeLabel="Activa" inactiveLabel="Inactiva" />
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyTableRow colSpan={5} message="No hay asignaciones registradas todavía." />
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminDashboard;