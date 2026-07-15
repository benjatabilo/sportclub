const API_URL = "http://localhost:3000/api/sport-rooms";

// --- Helpers de autenticación ---
const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// --- Métodos de la API ---

/** Obtener listado de asignaciones (deporte + sala + coach) */
export async function getSportRooms() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las asignaciones");
  }
  return data;
}

/** Crear una nueva asignación */
export async function createSportRoom(sportRoomData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(sportRoomData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear la asignación");
  }
  return data;
}

/** Actualizar una asignación existente */
export async function updateSportRoom(id, sportRoomData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(sportRoomData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar la asignación");
  }
  return data;
}

/** Eliminar una asignación */
export async function deleteSportRoom(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Error al eliminar la asignación");
  }
  return true;
}