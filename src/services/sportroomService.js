const API_URL = import.meta.env.VITE_API_URL;

// --- Helpers de autenticación ---
const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

/** * Helper centralizado para peticiones a la API
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
  
  // Manejo especial para DELETE (que puede no devolver JSON)
  if (response.status === 204) return true;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición a la API");
  }
  return data;
}

// --- Métodos de la API ---

export async function getSportRooms() {
  return await apiRequest("/sport-rooms");
}

export async function createSportRoom(sportRoomData) {
  return await apiRequest("/sport-rooms", "POST", sportRoomData);
}

export async function updateSportRoom(id, sportRoomData) {
  return await apiRequest(`/sport-rooms/${id}`, "PUT", sportRoomData);
}

export async function deleteSportRoom(id) {
  return await apiRequest(`/sport-rooms/${id}`, "DELETE");
}