import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";
import logo from "../assets/logo.png"

function UserLayout() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container fluid>
      <Row>
        {/* SIDEBAR: Aquí va tu menú lateral */}
        <Col md={2} className="bg-light min-vh-100 p-3 border-end">
          <div className="mb-4 text-center">
            <img
              src={logo}
              alt="Logo SportClub"
              style={{width: "100px", height: "auto" }}/>
          
          </div>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/user/dashboard" className="fw-bold">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/user/reservas" className="fw-bold">Reservas</Nav.Link>
            <Nav.Link as={Link} to="/user/clases" className="fw-bold">Clases</Nav.Link>
            <Nav.Link as={Link} to="/user/perfil" className="fw-bold">Mi Perfil</Nav.Link>
          </Nav>
        </Col>

        {/* CONTENIDO PRINCIPAL: Donde se cargan las páginas */}
        <Col md={10} className="p-4">
          <div className="d-flex justify-content-end align-items-center mb-4 border-bottom pb-2">
            <span className="me-3 text-muted">
              <strong>{user?.name}</strong> | {user?.email}
            </span>
            <Button variant="outline-primary" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
          
          {/* Aquí inyectas el Dashboard */}
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default UserLayout;