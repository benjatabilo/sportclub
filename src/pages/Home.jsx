import { Container, Row, Col, Button, Card } from "react-bootstrap";

function Home() {
  const plans = [
    { name: "Plan Básico", price: "$19.990", features: ["Acceso a sala de pesas", "Duchas y camarines", "Evaluación inicial"] },
    { name: "Plan Pro", price: "$29.990", features: ["Todo lo básico", "Acceso a clases grupales", "Acceso 24/7"] },
    { name: "Plan Elite", price: "$39.990", features: ["Todo lo Pro", "Entrenador personal", "Acceso a todos los clubes"] }
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="text-white py-5 text-center" style={{ backgroundColor: "#4828a7" }}>
        <Container>
          <h1 className="display-3 fw-bold">Transforma tu vida</h1>
          <p className="lead mb-4">El gimnasio diseñado para tus objetivos. ¡Empieza hoy!</p>
          <Button style={{ backgroundColor: "#ff7c2a", border: "none", padding: "10px 30px" }}>Comenzar Ahora</Button>
        </Container>
      </section>

      {/* 2. Planes */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5" style={{ color: "#4828a7" }}>Nuestros Planes</h2>
          <Row>
            {plans.map((plan, i) => (
              <Col md={4} key={i}>
                <Card className="text-center h-100 shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h4 className="mb-3">{plan.name}</h4>
                    <h2 className="fw-bold" style={{ color: "#ff7c2a" }}>{plan.price}</h2>
                    <ul className="list-unstyled my-4">
                      {plan.features.map((f, idx) => <li key={idx} className="mb-2 text-muted">{f}</li>)}
                    </ul>
                    <Button variant="outline-primary" style={{ borderColor: "#4828a7", color: "#4828a7" }}>Elegir Plan</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 3. Beneficios / Por qué elegirnos */}
      <section className="py-5 text-white" style={{ backgroundColor: "#4828a7" }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="mb-4">¿Por qué elegir nuestro Gym?</h2>
              <p>Contamos con tecnología de punta, coaches certificados y un ambiente motivador donde todos somos parte del equipo.</p>
            </Col>
            <Col md={6}>
              <div className="bg-white text-dark p-4 rounded shadow">
                <h5>✔ Máquinas de alta gama</h5>
                <h5>✔ Clases con expertos</h5>
                <h5>✔ Ambiente seguro</h5>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;