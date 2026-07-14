const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  // Se incluye el Bearer token solo si existe
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

/** Obtener listado de horarios de clases */
export async function getClassSchedules() {
  // Asegúrate de concatenar el endpoint específico después del /api
  const response = await fetch(`${API_URL}/classes/schedules`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener los horarios de clases");
  }
  return data;
}