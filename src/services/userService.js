const API_URL = import.meta.env.VITE_API_URL;

// --- Helpers de autenticación ---
const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

/** Helper centralizado para peticiones a la API */
async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: getHeaders(),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  // Manejo de respuestas sin contenido (común en DELETE o éxito sin datos)
  if (response.status === 204) return true;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición a la API");
  }
  return data;
}

// --- Métodos de la API ---

/** Obtener listado de usuarios */
export async function getUsers() {
  return await apiRequest("/users");
}

/** Crear un nuevo usuario */
export async function createUser(userData) {
  return await apiRequest("/users", "POST", userData);
}

/** Actualizar un usuario existente */
export async function updateUser(id, userData) {
  return await apiRequest(`/users/${id}`, "PUT", userData);
}

/** Eliminar un usuario */
export async function deleteUser(id) {
  return await apiRequest(`/users/${id}`, "DELETE");
}