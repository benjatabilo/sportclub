import { useState } from "react"; // 1. Importa useState
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getUser, logout, saveSession } from "../services/authService"; // Asegúrate de importar saveSession
import logo from "../assets/logo.png";
import UserProfile from "../pages/UserProfile"; // 2. Importa el componente de perfil

function CoachLayout() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // 3. Estado del modal
  const [userData, setUserData] = useState(getUser()); // 4. Estado del usuario

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/coach/dashboard", label: "Inicio Coach" },
    { to: "/coach/coachclass", label: "Mis Clases" },
    { to: "/coach/coachschedule", label: "Horarios" },
  ];

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
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
                  backgroundColor: isActive ? "#4828a7" : "transparent" 
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
              Bienvenido, <strong>{userData?.full_name}</strong>
            </span>
            
            {/* 5. Círculo de perfil (Botón que abre el modal) */}
            <div 
              onClick={() => setShowModal(true)} 
              className="me-3 d-flex align-items-center justify-content-center"
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                backgroundColor: '#4828a7', color: 'white',
                cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem'
              }}
            >
              {userData?.full_name?.charAt(0).toUpperCase()}
            </div>

            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
          <div className="p-4"><Outlet /></div>
        </Col>
      </Row>

      {/* 6. Modal de Perfil */}
      <UserProfile 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        user={userData}
        brandColor="#4828a7"
        onUpdateSuccess={(updatedUser) => {
          setUserData(updatedUser);
          saveSession(localStorage.getItem("token"), updatedUser);
        }}
      />
    </Container>
  );
}

export default CoachLayout;