import { Container, Spinner } from "react-bootstrap";

/*
Spinner de carga reutilizable para páginas que esperan datos del backend.
 */
function PageLoader({ color, fluid = false, message }) {
  return (
    <Container fluid={fluid} className={fluid ? "py-5 text-center" : "p-4 text-center"}>
      <Spinner animation="border" style={color ? { color } : undefined} />
      {message && <p className="mt-2 mb-0">{message}</p>}
    </Container>
  );
}

export default PageLoader;