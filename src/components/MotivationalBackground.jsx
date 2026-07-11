const FRASES_MOTIVACIONALES = [
  "SIN EXCUSAS",
  "TU MEJOR VERSIÓN",
  "DISCIPLINA",
  "NO TE RINDAS",
  "CONSTANCIA",
];

/**
 * Envuelve el contenido de una página con un fondo decorativo de frases
 * motivacionales repetidas, detrás del contenido (no tapa el color de
 * fondo real de la página, que sigue siendo el del layout).
 */
function MotivationalBackground({ children }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-60%",
            left: "-60%",
            width: "220%",
            height: "220%",
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
            justifyContent: "center",
            gap: "2.5rem 4rem",
          }}
        >
          {Array.from({ length: 50 }).map((_, i) => (
            <span
              key={i}
              style={{
                fontSize: "3.4rem",
                fontWeight: 900,
                letterSpacing: "0.35em",
                color: "#000",
                opacity: 0.15,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
              }}
            >
              {FRASES_MOTIVACIONALES[i % FRASES_MOTIVACIONALES.length]}
            </span>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

export default MotivationalBackground;