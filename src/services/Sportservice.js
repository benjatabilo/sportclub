const API_URL = import.meta.env.VITE_API_URL;

// --- Helpers de autenticación ---
const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

/** Helper centralizado para peticiones */
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

/** Obtener listado de deportes */
export async function getSports() {
  // Ajustamos el endpoint según la ruta de tu API (ej. /sports)
  return await apiRequest("/sports");
}