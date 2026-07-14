// Usamos la variable de entorno centralizada
const API_URL = import.meta.env.VITE_API_URL;

// --- Helpers de autenticación ---
const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

// --- Métodos de la API ---

/** Helper interno para evitar repetir la lógica de fetch */
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}/coach${endpoint}`, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición a la API");
  }
  return data;
}

export async function getMySchedules() {
  return await apiRequest("/my-schedules");
}

export async function getMyClasses() {
  return await apiRequest("/my-classes");
}

export async function getMyRooms() {
  return await apiRequest("/my-rooms");
}

export async function getCoachDashboard() {
  return await apiRequest("/dashboard");
}