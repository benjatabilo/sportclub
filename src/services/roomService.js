import { authFetch } from "./apiFetch";

export const getRooms = () => authFetch('/rooms');
export const createRoom = (data) => authFetch('/rooms', { method: 'POST', body: JSON.stringify(data) });
export const updateRoom = (id, data) => authFetch(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteRoom = (id) => authFetch(`/rooms/${id}`, { method: 'DELETE' });