import { Container, Row, Col, Card, Button, Table, Alert } from "react-bootstrap";
import { getUser } from "../../services/authService";

function UserDashboard() {
  const user = getUser(); // Obtenemos el usuario real

  const reservations = [
    { id: 1, class: "Yoga", day: "Lunes", time: "08:00", coach: "Ana Smith" },
    { id: 2, class: "Crossfit", day: "Martes", time: "18:00", coach: "Luis Perez" },
    { id: 3, class: "Natación", day: "Miércoles", time: "09:00", coach: "Carlos Ruíz" },
    { id: 4, class: "Spinning", day: "Jueves", time: "19:00", coach: "Marta Díaz" },
    { id: 5, class: "Pilates", day: "Viernes", time: "10:00", coach: "Ana Smith" },
  ];

  return (
    <Container className="py-4">
      {/* 1. Bienvenida con datos reales */}
      <Alert variant="primary" className="mb-4 shadow-sm">
        <Alert.Heading>¡Bienvenido, {user?.full_name || "Usuario"}!</Alert.Heading>
        <p className="mb-0">
          Continúa entrenando para alcanzar tus metas. ¡Hoy es un gran día para avanzar!
        </p>
      </Alert>

      <Row>
        {/* 2. Reservas del usuario */}
        <Col md={8}>
          <h4 className="text-primary mb-3">Mis Reservas</h4>
          <Table striped bordered hover responsive>
            <thead className="bg-primary text-white">
              <tr>
                <th>Clase</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Coach</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td>{res.class}</td>
                  <td>{res.day}</td>
                  <td>{res.time}</td>
                  <td>{res.coach}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* 4. Perfil Rápido con datos reales */}
        <Col md={4}>
          <Card className="shadow-sm border-primary">
            <Card.Header className="bg-primary text-white">Mi Perfil</Card.Header>
            <Card.Body>
              <Card.Title>{user?.full_name || "Sin nombre"}</Card.Title>
              <Card.Text>
                <strong>Correo:</strong> {user?.email || "No disponible"} <br />
               {/*} <strong>Deporte favorito:</strong> {user?.favoriteSport || "No definido"} // se desativa info*/} 
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 3. Clases disponibles */}
      <h4 className="text-primary mt-5 mb-3">Clases Disponibles</h4>
      <Row>
        {[1, 2, 3].map((item) => (
          <Col md={4} key={item}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={`https://picsum.photos/300/150?random=${item}`} />
              <Card.Body>
                <Card.Title>Clase de Fitness {item}</Card.Title>
                <Card.Text>Entrenamiento intenso para mejorar tu resistencia física.</Card.Text>
                <Button variant="primary">Reservar</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default UserDashboard;