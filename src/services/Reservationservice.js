const API_URL = "http://localhost:3000/api/reservations";

// --- Helpers de autenticación ---
const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// --- Métodos de la API ---

/** Obtener las reservas del usuario autenticado */
export async function getMyReservations() {
  const response = await fetch(`${API_URL}/my-reservations`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener tus reservas");
  }
  return data;
}

/** Crear una nueva reserva para un horario de clase */
export async function createReservation(class_schedule_id) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ class_schedule_id }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear la reserva");
  }
  return data;
}

/** Cancelar una reserva existente */
export async function cancelReservation(id) {
  // El backend no tiene DELETE /reservations/:id, solo
  // PATCH /reservations/:id/cancel (ver reservation.routes.js).
  const response = await fetch(`${API_URL}/${id}/cancel`, {
    method: "PATCH",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al cancelar la reserva");
  }
  return data;
}