import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";
import logo from "../assets/logo.png";

function AdminLayout() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container fluid>
      <Row>
        {/* SIDEBAR: Adaptado para ADMIN (Rojo) */}
        <Col md={2} className="bg-light min-vh-100 p-3 border-end">
          <div className="mb-4 text-center">
            <img
              src={logo}
              alt="Logo SportClub"
              style={{ width: "100px", height: "auto" }}
            />
          </div>
                    
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/admin/users" className="fw-bold text-dark">Gestionar Usuarios</Nav.Link>
            <Nav.Link as={Link} to="/admin/clases" className="fw-bold text-dark">Gestionar Clases</Nav.Link>
            <Nav.Link as={Link} to="/admin/reportes" className="fw-bold text-dark">Reportes</Nav.Link>
          </Nav>
        </Col>
        

        

        {/* INFO PRINICPAL */}
        <Col md={10} className="p-4">
          <div className="d-flex justify-content-end align-items-center mb-4 border-bottom pb-2">
            <span className="me-3 text-muted">
              {/* Usamos full_name */}
              <strong>{user?.full_name}</strong> | <span className="text-danger">{user?.email}</span>
            </span>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
          
          {/* Aquí se cargan las vistas de Admin */}
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default AdminLayout;