import { Container, Row, Col, Card, Table } from "react-bootstrap";

function AdminDashboard() {
  // Datos de ejemplo para las estadísticas
  const stats = [
    { title: "Usuarios Activos", value: "1,284", color: "primary" },
    { title: "Salas Ocupadas", value: "8/12", color: "success" },
    { title: "Clases Hoy", value: "24", color: "warning" },
  ];

  return (
    <Container fluid className="py-4">

      {/* 2. Tarjetas de Estadísticas (Estilo image_493842.jpg) */}
      <Row className="mb-4">
        {stats.map((stat, idx) => (
          <Col md={4} key={idx}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <small className="text-muted text-uppercase fw-bold">{stat.title}</small>
                <h3 className="fw-bold mt-2">{stat.value}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 3. Tabla de Actividad Reciente */}
      <h5 className="mb-3">Últimas Asignaciones</h5>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table responsive hover className="mb-0">
            <thead>
              <tr className="text-muted">
                <th>Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Horario</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Yoga</td>
                <td>Sala 1</td>
                <td>Ana Pérez</td>
                <td>08:00 AM</td>
              </tr>
              {/* Aquí podrías mapear tus datos reales */}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminDashboard;