import { useState } from "react"; // 1. Importar useState
import { Container, Row, Col, Nav, Button, Modal } from "react-bootstrap"; // 2. Importar Modal
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";
import logo from "../assets/logo.png";
import Assigments from "../pages/admin/Assignments"; 
import Shedules from "../pages/admin/Shedules";
import Sports from "../pages/admin/Sports";

function AdminLayout() {
  const navigate = useNavigate();
  const user = getUser();
  const [showSportModal, setShowSportModal] = useState(false); // 4. Estado para el modal

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/admin/dashboard", label: "Inicio" },
    { to: "/admin/users", label: "Gestionar Usuarios" },
    { to: "/admin/salas", label: "Gestión de Salas" },
    { to: "/admin/sports", label: "Gestión Deportes" },
    { to: "/admin/shedules", label: "Gestión de Horarios" },
  ];

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={2} className="bg-white vh-100 p-3 border-end shadow-sm">
          <div className="mb-4 text-center"><img src={logo} alt="Logo" style={{ width: "120px" }} /></div>
          
          <Nav className="flex-column gap-2 text-start">
            {navLinks.map((link) => (
              <NavLink to={link.to} key={link.to} className={({ isActive }) => `nav-link px-3 py-2 rounded-2 text-decoration-none ${isActive ? "text-white" : "text-secondary"}`} style={({ isActive }) => ({ fontSize: "0.75rem", textAlign: "left", backgroundColor: isActive ? "#ff7c2a" : "transparent" })}>
                {link.label}
              </NavLink>
            ))}
            {/* 5. Botón para abrir el modal */}
            <div className="nav-link px-3 py-2 rounded-2 text-secondary" style={{ fontSize: "0.75rem", textAlign: "left", cursor: "pointer" }} onClick={() => setShowSportModal(true)}>
              Asignaciones
            </div>
          </Nav>
        </Col>

        <Col md={10} style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
          <div className="d-flex justify-content-end align-items-center p-3 bg-white border-bottom shadow-sm">
            <span className="me-3 text-muted" style={{ fontSize: "0.9rem" }}>Bienvenido, <strong>{user?.full_name}</strong></span>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>Cerrar Sesión</Button>
          </div>
          <div className="p-4"><Outlet /></div>
        </Col>
      </Row>

      {/* 6. Definición del Modal */}
      <Modal show={showSportModal} onHide={() => setShowSportModal(false)} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Asignaciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Assigments />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminLayout;