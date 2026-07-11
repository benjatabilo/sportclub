import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

const ORANGE = "#ff7c2a";
const ORANGE_LIGHT = "#ffb35c";
const PURPLE = "#4828a7";
const PURPLE_DEEP = "#2d1a6b";
const INK = "#1a1420";
const CREAM = "#fff7f0";
const TEXT_MUTED = "#6b5f7a";

/* ---------- Datos de contenido ---------- */

const BENEFICIOS = [
  { emoji: "🏋️", title: "Múltiples Deportes", text: "Yoga, funcional, spinning y más. Elige la disciplina que se ajusta a tu ritmo y tus metas." },
  { emoji: "📅", title: "Reserva en Línea", text: "Revisa los horarios disponibles en tiempo real y reserva tu cupo en segundos, desde el celular." },
  { emoji: "👤", title: "Coaches Certificados", text: "Cada clase tiene un coach asignado que guía tu progreso, sesión a sesión." },
  { emoji: "🏢", title: "Salas Equipadas", text: "Espacios pensados para cada disciplina, con la capacidad y el equipamiento adecuado." },
];

const PLANES = [
  {
    name: "Plan Básico",
    price: "19.990",
    highlight: false,
    items: ["Acceso a 1 deporte", "Reserva de clases online", "Perfil personal"],
  },
  {
    name: "Plan Plus",
    price: "29.990",
    highlight: true,
    items: ["Acceso a todos los deportes", "Reservas ilimitadas", "Coach asignado por clase", "Cancelación flexible"],
  },
  {
    name: "Plan Premium",
    price: "39.990",
    highlight: false,
    items: ["Todo lo del Plan Plus", "Prioridad de reserva", "Salas premium", "Asesoría personalizada"],
  },
];

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => { document.getElementById(id)?.scrollIntoView({}); }, 0);
    }
  }, [location.hash]);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }
        .sc-display { font-family: 'Anton', 'Inter', sans-serif; letter-spacing: 0.5px; }
        .sc-benefit-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .sc-benefit-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(45, 26, 107, 0.15) !important; }
        .sc-plan-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .sc-plan-card:hover { transform: translateY(-6px); }
        .sc-cta:hover { filter: brightness(1.08); }
      `}</style>

      {/* ============ HERO ============ */}
      <section
        id="hero"
        className="position-relative overflow-hidden"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url('/src/assets/gym2.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingTop: "5rem",
          paddingBottom: "7rem",
        }}
      >
        <Container className="position-relative text-center text-white" style={{ maxWidth: "760px" }}>
          <h1 className="sc-display mb-4" style={{ fontSize: "clamp(2.5rem, 6vw, 4.2rem)", lineHeight: 1.05 }}>
            TU MEJOR VERSIÓN<br />EMPIEZA HOY
          </h1>
          <p className="fs-5 mb-5 mx-auto" style={{ maxWidth: "560px", opacity: 0.9, fontWeight: 400 }}>
            Reserva tus clases, sigue tus horarios y entrena con coaches certificados.
            Todo tu club deportivo, organizado en un solo lugar.
          </p>
          <Button as={Link} to="/register" size="lg" className="sc-cta fw-bold border-0 px-5 py-3" style={{ backgroundColor: ORANGE, borderRadius: "50px", fontSize: "1.05rem" }}>
            Únete Ahora
          </Button>
        </Container>
      </section>

      {/* ============ BENEFICIOS ============ */}
      <section id="beneficios" style={{ backgroundColor: CREAM, padding: "5.5rem 0" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="sc-display" style={{ color: PURPLE_DEEP, fontSize: "2.2rem" }}>Beneficios</h2>
          </div>
          <Row className="g-4">
            {BENEFICIOS.map((b, i) => (
              <Col key={i} md={6} lg={3}>
                <div className="sc-benefit-card h-100 bg-white p-4 text-center" style={{ borderRadius: "1.25rem", boxShadow: "0 8px 24px rgba(45,26,107,0.08)" }}>
                  <div className="d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 60, height: 60, borderRadius: "50%", backgroundColor: "rgba(72,40,167,0.1)", fontSize: "1.8rem" }}>
                    {b.emoji}
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: PURPLE_DEEP }}>{b.title}</h5>
                  <p className="mb-0" style={{ color: TEXT_MUTED, fontSize: "0.92rem" }}>{b.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ============ PLANES ============ */}
      <section id="planes" style={{ backgroundColor: "white", padding: "5.5rem 0" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="sc-display" style={{ color: PURPLE_DEEP, fontSize: "2.2rem" }}>Planes y Precios</h2>
          </div>
          <Row className="g-4 justify-content-center">
            {PLANES.map((plan, i) => (
              <Col key={i} md={6} lg={4}>
                <div className="sc-plan-card h-100 p-4 position-relative" style={{ borderRadius: "1.25rem", backgroundColor: plan.highlight ? PURPLE_DEEP : "white", color: plan.highlight ? "white" : INK, border: plan.highlight ? "none" : "1px solid #eee", boxShadow: plan.highlight ? "0 20px 45px rgba(45,26,107,0.35)" : "0 8px 24px rgba(0,0,0,0.06)" }}>
                  {plan.highlight && <span className="position-absolute top-0 start-50 translate-middle fw-bold text-uppercase px-3 py-1" style={{ backgroundColor: ORANGE, color: "white", borderRadius: "50px", fontSize: "0.7rem", letterSpacing: "1px" }}>Más Popular</span>}
                  <h5 className="fw-bold mb-1 mt-2">{plan.name}</h5>
                  <div className="mb-4"><span className="sc-display" style={{ fontSize: "2.3rem" }}>${plan.price}</span><span style={{ opacity: 0.7, fontSize: "0.9rem" }}> / mes</span></div>
                  <ul className="list-unstyled mb-4">
                    {plan.items.map((item, j) => (
                      <li key={j} className="d-flex align-items-center gap-2 mb-2"><span>✔️</span><span style={{ fontSize: "0.92rem" }}>{item}</span></li>
                    ))}
                  </ul>
                  <Button as={Link} to="/register" className="w-100 fw-bold border-0 py-2" style={{ backgroundColor: plan.highlight ? ORANGE : PURPLE, borderRadius: "50px" }}>Elegir Plan</Button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

{/* ============ SOBRE EL CLUB ============ */}
      <section style={{ 
        padding: "4rem 0", 
        color: "white",
        background: `linear-gradient(135deg, ${PURPLE_DEEP}EE 0%, ${INK}EE 100%), url('/src/assets/gym3.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <Container>
          <div className="text-center mb-4">
            <h2 className="sc-display" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>SOBRE EL CLUB</h2>
          </div>
          <Row className="g-4 justify-content-center text-center">
            <Col md={4}>
              <h5 className="fw-bold mb-2" style={{ color: ORANGE_LIGHT }}>Misión</h5>
              <p style={{ opacity: 0.85, fontSize: "0.9rem", lineHeight: "1.4" }}>
                Facilitar el acceso a una vida activa, ofreciendo clases variadas y una plataforma simple para reservar sin complicaciones.
              </p>
            </Col>
            <Col md={4}>
              <h5 className="fw-bold mb-2" style={{ color: ORANGE_LIGHT }}>Visión</h5>
              <p style={{ opacity: 0.85, fontSize: "0.9rem", lineHeight: "1.4" }}>
                Ser el club deportivo de referencia por nuestra comunidad y la calidad de la experiencia digital que acompaña cada entrenamiento.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

{/* ============ FOOTER ============ */}
      <footer id="contacto" style={{ backgroundColor: INK, color: "white", padding: "4rem 0 2rem" }}>
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <h5 className="sc-display mb-3" style={{ color: ORANGE }}>SPORTCLUB</h5>
              <p style={{ opacity: 0.7, fontSize: "0.9rem", lineHeight: "1.6" }}>
                Tu club deportivo, organizado en un solo lugar. Entrena con los mejores.
              </p>
            </Col>
            <Col md={4}>
              <h6 className="fw-bold mb-3" style={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.85rem" }}>Contacto</h6>
              <p style={{ opacity: 0.7, fontSize: "0.9rem", lineHeight: "1.8" }}>
                contacto@sportclub.cl<br/>
                +56 9 1234 5678
              </p>
            </Col>
            <Col md={4}>
              <h6 className="fw-bold mb-3" style={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.85rem" }}>Accesos</h6>
              <div className="d-flex flex-column gap-2">
                <a href="#beneficios" style={{ color: "white", opacity: 0.7, textDecoration: "none", fontSize: "0.9rem" }}>Beneficios</a>
                <a href="#planes" style={{ color: "white", opacity: 0.7, textDecoration: "none", fontSize: "0.9rem" }}>Planes</a>
              </div>
            </Col>
          </Row>
          
          <hr style={{ opacity: 0.1, margin: "3rem 0 2rem" }} />
          
          <p className="text-center mb-0" style={{ opacity: 0.5, fontSize: "0.75rem" }}>
            © {new Date().getFullYear()} SportClub. Todos los derechos reservados.
          </p>
        </Container>
      </footer>
    </div>
  );
}

export default Home;