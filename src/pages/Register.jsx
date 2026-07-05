import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Container, Form, Spinner, Row, Col } from "react-bootstrap";
import { authFetch } from "../services/apiFetch";
import Swal from "sweetalert2"; // Importación necesaria

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "", email: "", password: "", confirmPassword: "", 
    birth_date: "", sport: "Ninguno", otherSport: "", additional_info: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(formData.full_name)) {
      setLoading(false);
      return Swal.fire({ icon: 'error', title: 'Error', text: 'El nombre solo debe contener letras.' });
    }
    if (!emailRegex.test(formData.email)) {
      setLoading(false);
      return Swal.fire({ icon: 'error', title: 'Error', text: 'El formato del correo es inválido.' });
    }
    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      return Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden.' });
    }

    const finalSport = formData.sport === "Otro" ? formData.otherSport : formData.sport;
    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      birth_date: formData.birth_date,
      role: "user",
      must_change_password: false,
      metadata: { 
        sports: finalSport === "Ninguno" ? [] : [{ name: finalSport, frequency_per_week: 1 }],
        note: formData.additional_info
      }
    };

    try {
      await authFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Usuario registrado correctamente', showConfirmButton: false, timer: 2000 });
      setTimeout(() => navigate("/login"), 2000);
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
          <Col md={5} className="text-white p-5 d-flex flex-column justify-content-center" style={{ backgroundColor: 'rgb(34, 0, 101)' }}>
            <div style={{ fontSize: "9rem", color: "#ffc107", marginBottom: "-100px" }}>❝</div>
            <h1 className="fw-bold" style={{ fontSize:"3rem", marginTop: "0px" }}>Es hora de mostrar tu mejor versión!</h1>
          </Col>

          <Col md={7} className="p-5">
            <div style={{ marginBottom: "40px" }}>
              <h2 className="fw-bold" style={{ color: "#10004e", fontSize: "2rem", fontWeight: "700", fontFamily: "'Segoe UI', sans-serif" }}>Crea una cuenta</h2>
              <p className="m-0">¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none fw-bold">¡Iniciemos Sesión!</Link></p>
            </div>
            
            <Form onSubmit={handleSubmit}>
              <Row className="g-3 mb-3">
                <Col md={6}><Form.Group><Form.Label className="d-block text-start fw-semibold" style={{ fontSize: "0.7rem" }}>Nombre Completo</Form.Label><Form.Control type="text" size="sm" onChange={(e) => setFormData({...formData, full_name: e.target.value})} required /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label className="d-block text-start fw-semibold" style={{ fontSize: "0.7rem" }}>Correo</Form.Label><Form.Control type="email" size="sm" onChange={(e) => setFormData({...formData, email: e.target.value})} required /></Form.Group></Col>
              </Row>
              <Row className="g-3 mb-3">
                <Col md={6}><Form.Group><Form.Label className="d-block text-start fw-semibold" style={{ fontSize: "0.7rem" }}>Fecha de Nacimiento</Form.Label><Form.Control type="date" size="sm" onChange={(e) => setFormData({...formData, birth_date: e.target.value})} required /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label className="d-block text-start fw-semibold" style={{ fontSize: "0.7rem" }}>Deporte Favorito</Form.Label><Form.Select size="sm" onChange={(e) => setFormData({...formData, sport: e.target.value})}><option value="Fútbol">Fútbol</option><option value="Tenis">Tenis</option><option value="Basquetbol">Basquetbol</option><option value="Otro">Otro</option><option value="Ninguno">Ninguno</option></Form.Select></Form.Group></Col>
              </Row>
              <Row className="g-3 mb-4">
                <Col md={6}><Form.Group><Form.Label className="d-block text-start fw-semibold" style={{ fontSize: "0.7rem" }}>Contraseña</Form.Label><Form.Control type="password" size="sm" onChange={(e) => setFormData({...formData, password: e.target.value})} required /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label className="d-block text-start fw-semibold" style={{ fontSize: "0.7rem" }}>Confirmar Contraseña</Form.Label><Form.Control type="password" size="sm" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required /></Form.Group></Col>
              </Row>
              <Button type="submit" className="w-100 py-2 border-0 fw-bold" style={{ backgroundColor: '#ff9100' }} disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" className="me-2" /> : "Crear cuenta"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;