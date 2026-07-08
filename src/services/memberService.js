const API_URL = "http://localhost:3000/api/member";

// --- Helpers de autenticación ---
const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// --- Métodos de la API ---

/** Obtener las clases disponibles para reservar */
export async function getAvailableClasses() {
  const response = await fetch(`${API_URL}/classes`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las clases disponibles");
  }
  return data;
}

/** Obtener el detalle de una clase disponible por id */
export async function getClassDetail(id) {
  const response = await fetch(`${API_URL}/classes/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener el detalle de la clase");
  }
  return data;
}

/** Obtener el listado de deportes disponibles */
export async function getAvailableSports() {
  const response = await fetch(`${API_URL}/sports`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener los deportes disponibles");
  }
  return data;
}

/** Obtener el listado de salas disponibles */
export async function getAvailableRooms() {
  const response = await fetch(`${API_URL}/rooms`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las salas disponibles");
  }
  return data;
}

/** Obtener el resumen del dashboard del usuario autenticado */
export async function getMemberDashboard() {
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