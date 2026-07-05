import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";
import logo from "../assets/logo.png";

function CoachLayout() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/coach/dashboard", label: "Inicio Coach" },
    { to: "/coach/mis-clases", label: "Mis Clases" },
    { to: "/coach/alumnos", label: "Mis Alumnos" },
    { to: "/coach/horarios", label: "Horarios" },
  ];

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar con estilo Consistente */}
        <Col md={2} className="bg-white vh-100 p-3 border-end shadow-sm">
          <div className="mb-4 text-center">
            <img src={logo} alt="Logo" style={{ width: "120px" }} />
          </div>
          
          <div className="text-muted fw-bold mb-3 px-3" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>PANEL COACH</div>

          <Nav className="flex-column gap-2 text-start">
            {navLinks.map((link) => (
              <NavLink 
                to={link.to} 
                key={link.to} 
                className={({ isActive }) => 
                  `nav-link px-3 py-2 rounded-2 text-decoration-none ${isActive ? "text-white" : "text-secondary"}`
                } 
                style={({ isActive }) => ({ 
                  fontSize: "0.85rem", 
                  textAlign: "left", 
                  // Usamos un color verde para el coach, manteniendo el estilo del UserLayout
                  backgroundColor: isActive ? "#28a745" : "transparent" 
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </Nav>
        </Col>

        {/* Contenido Principal */}
        <Col md={10} style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
          <div className="d-flex justify-content-end align-items-center p-3 bg-white border-bottom shadow-sm">
            <span className="me-3 text-muted" style={{ fontSize: "0.9rem" }}>
              Bienvenido, <strong>{user?.full_name}</strong>
            </span>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
          <div className="p-4"><Outlet /></div>
        </Col>
      </Row>
    </Container>
  );
}

export default CoachLayout;