import { Container, Card, Button } from "react-bootstrap";

const DEFAULT_COLOR = "#ff7c2a";
const DARK = "#1a1420";


function TableCard({ title, color = DEFAULT_COLOR, actionLabel, onAction, children }) {
  return (
    <Container fluid className="py-4">
      <Card className="border-0 shadow-sm" style={{ borderRadius: "0.9rem", overflow: "hidden" }}>
        <Card.Header
          className="d-flex justify-content-between align-items-center text-white py-2"
          style={{
            background: `linear-gradient(90deg, ${DARK} 0%, ${color} 100%)`,
            letterSpacing: "0.5px",
          }}
        >
          <span className="fw-bold text-uppercase" style={{ fontSize: "0.9rem" }}>
            {title}
          </span>
          {actionLabel && (
            <Button
              size="sm"
              className="fw-semibold border-0"
              style={{ backgroundColor: "white", color, fontSize: "0.8rem" }}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </Card.Header>
        <Card.Body className="p-0" style={{ fontSize: "0.87rem" }}>
          {children}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TableCard;