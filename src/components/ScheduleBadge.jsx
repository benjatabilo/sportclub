import { Badge } from "react-bootstrap";

/**
 * El backend usa day_of_week de 1 a 7 (1=Lunes ... 7=Domingo), ver
 * classSchedule.validator.js. No es el 0=Domingo de JS Date.getDay().
 * Antes este mismo objeto estaba copiado en 5 archivos distintos
 * (y fue la causa de un bug real: el domingo salía "Día desconocido"
 * en un archivo donde alguien lo copió mal).
 */
export const DIAS_SEMANA = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

export function formatTime(t) {
  return t ? t.substring(0, 5) : "N/A";
}

/**
 * Badge con el horario de una clase. Por defecto muestra día + rango
 * horario ("Lunes 09:00 - 10:00"); con showDay={false} muestra solo
 * el rango horario, para tablas que ya tienen una columna "Día" aparte.
 */
function ScheduleBadge({ dayOfWeek, startTime, endTime, showDay = true, showEndTime = true, bg = "secondary", style, className }) {
  const dayLabel = showDay ? `${DIAS_SEMANA[dayOfWeek] || "Día desconocido"} ` : "";
  const timeLabel = showEndTime ? `${formatTime(startTime)} - ${formatTime(endTime)}` : formatTime(startTime);
  return (
    <Badge bg={style ? undefined : bg} style={style} className={className}>
      {dayLabel}{timeLabel}
    </Badge>
  );
}

export default ScheduleBadge;