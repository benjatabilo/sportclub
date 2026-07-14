const API_URL = import.meta.env.VITE_API_URL;

// --- Helpers de autenticación ---
const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

/** * Helper centralizado para todas las peticiones GET
 */
async function apiRequest(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición a la API");
  }
  return data;
}

// --- Métodos de la API ---

export async function getAvailableClasses() {
  return await apiRequest("/classes");
}

export async function getClassDetail(id) {
  return await apiRequest(`/classes/${id}`);
}

export async function getAvailableSports() {
  return await apiRequest("/sports");
}

export async function getAvailableRooms() {
  return await apiRequest("/rooms");
}

export async function getMemberDashboard() {
  return await apiRequest("/dashboard");
}