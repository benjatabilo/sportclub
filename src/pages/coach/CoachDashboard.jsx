import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { getUser } from "../../services/authService";

function CoachDashboard() {
  const user = getUser();

  // Métricas específicas para el Coach
  const coachStats = [
    { title: "Mis Clases Hoy", value: "4", color: "success" },
    { title: "Total Alumnos", value: "32", color: "success" },
    { title: "Horas de Entrenamiento", value: "18", color: "success" }
  ];

  return (
    <Container className="py-4">
      <h2 className="text-success mb-4">Panel del Entrenador</h2>
      
      {/* 1. Tarjetas de Resumen (Color Verde) */}
      <Row className="mb-4">
        {coachStats.map((stat, idx) => (
          <Col md={4} key={idx}>
            <Card className={`text-white bg-${stat.color} shadow-sm`}>
              <Card.Body>
                <Card.Title>{stat.title}</Card.Title>
                <Card.Text className="h2">{stat.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 2. Tabla de Clases próximas */}
      <h4 className="mb-3 text-success">Próximas Clases</h4>
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Clase</th>
                <th>Hora</th>
                <th>Cupos</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Yoga Matutino</td>
                <td>08:00</td>
                <td>12/15</td>
                <td><Badge bg="success">Confirmada</Badge></td>
              </tr>
              <tr>
                <td>Crossfit Avanzado</td>
                <td>18:00</td>
                <td>8/10</td>
                <td><Badge bg="warning">Casi lleno</Badge></td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CoachDashboard;