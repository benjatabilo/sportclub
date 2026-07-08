import { useState } from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getUser, logout, saveSession } from "../services/authService";
import logo from "../assets/logo.png";
import UserProfile from "../pages/UserProfile";

function UserLayout() {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState(getUser());

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/user/dashboard", label: "Inicio" },
    { to: "/user/userreserve", label: "Reservas" },
    { to: "/user/userclass", label: "Clases" },

  ];

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar con estilo Admin */}
        <Col md={2} className="bg-white vh-100 p-3 border-end shadow-sm">
          <div className="mb-4 text-center">
            <img src={logo} alt="Logo" style={{ width: "120px" }} />
          </div>
          
          <Nav className="flex-column gap-2 text-start">
            {navLinks.map((link) => (
              <NavLink 
                to={link.to} 
                key={link.to} 
                className={({ isActive }) => 
                  `nav-link px-3 py-2 rounded-2 text-decoration-none ${isActive ? "text-white" : "text-secondary"}`
                } 
                style={({ isActive }) => ({ 
                  fontSize: "0.75rem", 
                  textAlign: "left", 
                  backgroundColor: isActive ? "#006b71" : "transparent" 
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </Nav>
        </Col>

        {/* Contenido Principal con fondo gris claro */}
        <Col md={10} style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
          <div className="d-flex justify-content-end align-items-center p-3 bg-white border-bottom shadow-sm">
            <span className="me-3 text-muted" style={{ fontSize: "0.9rem" }}>Bienvenido, <strong>{userData?.full_name}</strong></span>

            {/* Círculo de perfil */}
            <div
              onClick={() => setShowProfileModal(true)}
              className="me-3 d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#006b71', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {userData?.full_name?.charAt(0).toUpperCase()}
            </div>

            <Button variant="outline-danger" size="sm" onClick={handleLogout}>Cerrar Sesión</Button>
          </div>
          <div className="p-4"><Outlet /></div>
        </Col>
      </Row>

      {/* Modal de Perfil */}
      <UserProfile
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        user={userData}
        brandColor="#006b71"
        onUpdateSuccess={(updatedUser) => {
          setUserData(updatedUser);
          saveSession(localStorage.getItem("token"), updatedUser);
        }}
      />
    </Container>
  );
}

export default UserLayout;