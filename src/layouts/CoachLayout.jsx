import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";
import logo from "../assets/logo.png";

function CoachLayout() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container fluid>
      <Row>
        {/* SIDEBAR: Adaptado para COACH (Verde) */}
        <Col md={2} className="bg-light min-vh-100 p-3 border-end">
          <div className="mb-4 text-center">
            <img
              src={logo}
              alt="Logo SportClub"
              style={{ width: "100px", height: "auto" }}
            />
          </div>
          
          <div className="text-success fw-bold mb-3 px-2">PANEL COACH</div>
          
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/coach/dashboard" className="fw-bold text-dark">Inicio Coach</Nav.Link>
            <Nav.Link as={Link} to="/coach/mis-clases" className="fw-bold text-dark">Mis Clases</Nav.Link>
            <Nav.Link as={Link} to="/coach/alumnos" className="fw-bold text-dark">Mis Alumnos</Nav.Link>
            <Nav.Link as={Link} to="/coach/horarios" className="fw-bold text-dark">Horarios</Nav.Link>
          </Nav>
        </Col>

        {/* CONTENIDO PRINCIPAL */}
        <Col md={10} className="p-4">
          <div className="d-flex justify-content-end align-items-center mb-4 border-bottom pb-2">
            <span className="me-3 text-muted">
              <strong>{user?.full_name}</strong> | <span className="text-success">{user?.email}</span>
            </span>
            <Button variant="outline-success" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
          
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default CoachLayout;