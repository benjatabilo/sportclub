import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { getUser } from "../../services/authService";

function AdminDashboard() {
  const user = getUser();

  // Estadísticas del sistema
  const stats = [
    { title: "Usuarios Totales", value: "125", color: "danger" },
    { title: "Reservas Hoy", value: "48", color: "danger" },
    { title: "Clases Activas", value: "12", color: "danger" }
  ];

  return (
    <Container className="py-4">
      <h2 className="mb-4">Panel de Administración</h2>
      
      {/* 1. Tarjetas de Estadísticas (Color Rojo para Admin) */}
      <Row className="mb-4">
        {stats.map((stat, idx) => (
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

      {/* 2. Tabla de Gestión de Usuarios */}
      <h4 className="mb-3 text-danger">Gestión de Usuarios</h4>
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Juan Pérez</td>
                <td>juan@demo.cl</td>
                <td><Badge bg="secondary">User</Badge></td>
                <td><Badge bg="success">Activo</Badge></td>
              </tr>
              <tr>
                <td>Ana Coach</td>
                <td>ana@demo.cl</td>
                <td><Badge bg="warning">Coach</Badge></td>
                <td><Badge bg="success">Activo</Badge></td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminDashboard;