const API_URL = "http://localhost:3000/api/class-schedules";

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/** Obtener listado de horarios de clases */
export async function getClassSchedules() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener los horarios de clases");
  }
  return data;
}