import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import logo from "../assets/logo.png";

const PURPLE = "#10004e";
const ORANGE = "#ff7c2a";

function PublicLayout() {
  const goToSection = (hash) => (e) => {
    // Si estamos en otra página (no Home), esto redirigiría, 
    // pero aquí optimizamos el comportamiento interno.
    const element = document.getElementById(hash);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ paddingTop: "70px" }}> {/* Padding para compensar el fixed navbar */}
      <Navbar 
        fixed="top" 
        expand="md" 
        variant="dark" 
        className="shadow-sm"
        style={{ 
          backgroundColor: PURPLE,
          padding: "0.5rem 0",
          transition: "background 0.3s ease" 
        }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img src={logo} alt="SportClub" style={{ height: "40px" }} />
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="main-navbar" />
          
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto align-items-md-center gap-3">
              <Nav.Link as={Link} to="/" className="fw-medium">Inicio</Nav.Link>
              <Nav.Link href="#planes" onClick={goToSection("planes")} className="fw-medium">Planes</Nav.Link>
              <Nav.Link href="#beneficios" onClick={goToSection("beneficios")} className="fw-medium">Beneficios</Nav.Link>
              <Nav.Link href="#contacto" onClick={goToSection("contacto")} className="fw-medium">Contacto</Nav.Link>
              
              {/* Botón de Login destacado */}
                <Button 
                as={Link} 
                to="/login" 
                className="ms-md-2 px-4 rounded-pill fw-bold"
                style={{ 
                    backgroundColor: "transparent",
                    color: "#ff7c2a",
                    border: "2px solid #ff7c2a"
                }}
                onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#ff7c2a";
                    e.target.style.color = "#ffffff";
                }}
                onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#ff7c2a";
                }}
                >
                Login
                </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>    
      </Navbar>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;