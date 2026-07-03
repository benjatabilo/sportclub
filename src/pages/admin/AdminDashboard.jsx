import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Badge, Alert } from "react-bootstrap";
import { getUser } from "../../services/authService";
import { getUsers } from "../../services/userService"; 
//import UserCard from "../../components/UserCard";

function AdminDashboard() {
  const [users, setUsers] = useState([]); 
  const [error, setError] = useState(null);
  const currentUser = getUser();

useEffect(() => {
    getUsers()
      .then((result) => {
        // Verifica en la consola qué trae 'result'
        console.log("Respuesta completa del backend:", result);

        // Si tu API devuelve { ok: true, data: [...] }
        // Debes acceder a result.data
        if (result && Array.isArray(result.data)) {
          setUsers(result.data);
        } 
        // Si tu API devuelve el arreglo directamente, deja solo result
        else if (Array.isArray(result)) {
          setUsers(result);
        }
        else {
          setError("No se pudo obtener la lista de usuarios.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar usuarios: " + err.message);
      });
  }, []);

  const stats = [
    { title: "Usuarios Totales", value: Array.isArray(users) ? users.length : 0, color: "danger" },
    { title: "Reservas Hoy", value: "48", color: "danger" },
    { title: "Clases Activas", value: "12", color: "danger" }
  ];

  return (
    <Container className="py-4">
      <h2 className="mb-4">Panel de Administración</h2>
      
      {/* 1. Tarjetas de Estadísticas */}
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

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {/* 2. Galería de Usuarios 
      <h4 className="mb-3 text-danger">Directorio de Usuarios</h4>
      <Row className="mb-4">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <Col md={4} key={user.id} className="mb-3">
              <UserCard user={user} />
            </Col>
          ))
        ) : (
          !error && <Col><p className="text-muted">No hay usuarios disponibles.</p></Col>
        )}
      </Row> */}

      {/* 3. Tabla de Control (Usando campos reales del modelo) */}
      <h4 className="mb-3 text-danger">Gestion de Usuarios </h4>
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.full_name}</td> {/* Campo de image_a53065.png y image_a5306d.png */}
                  <td>{user.email}</td>
                  <td><Badge bg={user.role === 'admin' ? 'danger' : 'secondary'}>{user.role}</Badge></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminDashboard;