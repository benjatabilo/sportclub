import { Badge } from "react-bootstrap";

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