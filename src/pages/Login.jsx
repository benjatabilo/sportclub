import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Container, Form, Spinner, Row, Col } from "react-bootstrap";
import { loginUser, saveSession } from "../services/authService";
import Swal from "sweetalert2"; // Integrando SweetAlert2 para consistencia

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(formData);
      saveSession(data.data.token, data.data.user);

      Swal.fire({ icon: 'success', title: '¡Bienvenido!', text: 'Sesión iniciada correctamente', showConfirmButton: false, timer: 1500 });
      
      const role = data.data.user.role;
      setTimeout(() => {
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "coach") navigate("/coach/dashboard");
        else navigate("/user/dashboard");
      }, 1500);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: 'rgb(28, 0, 84)' }}>
      <Container className="bg-white rounded-4 shadow-lg p-0 overflow-hidden" style={{ maxWidth: "900px" }}>
        <Row className="g-0">
          {/* Lado izquierdo (estética espejo al registro) */}
          <Col md={5} className="text-white p-5 d-flex flex-column justify-content-center" style={{ backgroundColor: 'rgb(34, 0, 101)' }}>
            <div style={{ fontSize: "9rem", color: "#ffc107", marginBottom: "-100px" }}>❝</div>
            <h1 className="fw-bold" style={{ fontSize:"3rem" }}>¡Se tu mejor versión!     </h1>
          </Col>

          {/* Lado derecho (formulario login) */}
          <Col md={7} className="p-5">
            <div style={{ marginBottom: "40px" }}>
              <h2 className="fw-bold" style={{ color: "#10004e", fontSize: "2rem", fontWeight: "700" }}>Iniciar Sesión</h2>
              <p className="m-0">¿No tienes cuenta? <Link to="/register" className="text-decoration-none fw-bold">¡Regístrate aquí!</Link></p>
            </div>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="d-block text-start fw-semibold" style={{ fontSize: "0.8rem" }}>Correo</Form.Label>
                <Form.Control type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="d-block text-start fw-semibold" style={{ fontSize: "0.8rem" }}>Contraseña</Form.Label>
                <Form.Control type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              </Form.Group>

              <Button type="submit" className="w-100 py-2 border-0 fw-bold" style={{ backgroundColor: '#ff9100' }} disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" className="me-2" /> : "Ingresar"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;