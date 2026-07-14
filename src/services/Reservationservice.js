const API_URL = import.meta.env.VITE_API_URL;

// --- Helpers de autenticación ---
const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

/** * Helper centralizado para todas las peticiones
 */
async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: getHeaders(),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición a la API");
  }
  return data;
}

// --- Métodos de la API ---

/** Obtener las reservas del usuario autenticado */
export async function getMyReservations() {
  return await apiRequest("/my-reservations");
}

/** Crear una nueva reserva para un horario de clase */
export async function createReservation(class_schedule_id) {
  // Asegúrate de que el endpoint sea el correcto (ej. /reservations)
  return await apiRequest("/reservations", "POST", { class_schedule_id });
}

/** Cancelar una reserva existente */
export async function cancelReservation(id) {
  // Usamos PATCH como requiere tu backend
  return await apiRequest(`/reservations/${id}/cancel`, "PATCH");
}