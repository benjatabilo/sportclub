import { useState } from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getUser, logout, saveSession } from "../services/authService";
import logo from "../assets/logo.png";
import UserProfile from "../pages/UserProfile";
import { HomeIcon, CalendarNavIcon, DumbbellNavIcon } from "../components/icons";

const BRAND = "#006b71";
const DARK = "#1a1420";

function UserLayout() {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState(getUser());

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/user/dashboard", label: "Inicio", icon: HomeIcon },
    { to: "/user/userreserve", label: "Reservas", icon: CalendarNavIcon },
    { to: "/user/userclass", label: "Clases", icon: DumbbellNavIcon },
  ];

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs={12} md={2} className="min-vh-100 p-3" style={{ backgroundColor: DARK }}>
          <div className="mb-4 text-center pb-3" style={{ borderBottom: `2px solid ${BRAND}` }}>
            <img src={logo} alt="Logo" style={{ width: "120px" }} />
          </div>

          <Nav className="flex-column gap-1 text-start">
            {navLinks.map((link) => (
              <NavLink
                to={link.to}
                key={link.to}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-2 text-decoration-none d-flex align-items-center gap-2 text-nowrap ${
                    isActive ? "text-white" : "text-white-50"
                  }`
                }
                style={({ isActive }) => ({
                  fontSize: "0.8rem",
                  textAlign: "left",
                  backgroundColor: isActive ? BRAND : "transparent",
                  transition: "background-color 0.15s ease",
                })}
              >
                <link.icon />
                {link.label}
              </NavLink>
            ))}
          </Nav>
        </Col>

        {/* Contenido Principal con fondo gris claro */}
        <Col xs={12} md={10} style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
          <div
            className="d-flex justify-content-end align-items-center p-3"
            style={{ background: `linear-gradient(90deg, ${DARK} 0%, ${BRAND} 100%)` }}
          >
            <span className="me-3 text-white-50" style={{ fontSize: "0.9rem" }}>
              Bienvenido, <strong className="text-white">{userData?.full_name}</strong>
            </span>

            {/* Círculo de perfil */}
            <div
              onClick={() => setShowProfileModal(true)}
              className="me-3 d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "white",
                color: BRAND,
                cursor: "pointer",
                fontWeight: "bold",
                border: `2px solid ${BRAND}`,
              }}
            >
              {userData?.full_name?.charAt(0).toUpperCase()}
            </div>

            <Button
              size="sm"
              className="fw-semibold border-0"
              style={{ backgroundColor: "white", color: "#dc3545" }}
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </div>
          <div className="p-4">
            <Outlet />
          </div>
        </Col>
      </Row>

      {/* Modal de Perfil */}
      <UserProfile
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        user={userData}
        brandColor={BRAND}
        onUpdateSuccess={(updatedUser) => {
          setUserData(updatedUser);
          saveSession(localStorage.getItem("token"), updatedUser);
        }}
      />
    </Container>
  );
}

export default UserLayout;