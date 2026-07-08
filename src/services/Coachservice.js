const API_URL = "http://localhost:3000/api/coach";

// --- Helpers de autenticación ---
const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// --- Métodos de la API ---

/** Obtener los horarios del coach autenticado */
export async function getMySchedules() {
  const response = await fetch(`${API_URL}/my-schedules`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener los horarios");
  }
  return data;
}

/** Obtener las clases (asignaciones) del coach autenticado */
export async function getMyClasses() {
  const response = await fetch(`${API_URL}/my-classes`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las clases");
  }
  return data;
}

/** Obtener las salas asignadas al coach autenticado */
export async function getMyRooms() {
  const response = await fetch(`${API_URL}/my-rooms`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las salas");
  }
  return data;
}

/** Obtener el resumen del dashboard del coach autenticado */
export async function getCoachDashboard() {
  const response = await fetch(`${API_URL}/dashboard`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener el dashboard");
  }
  return data;
}