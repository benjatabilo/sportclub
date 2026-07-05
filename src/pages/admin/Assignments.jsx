import { useState, useEffect } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { authFetch } from "../../services/apiFetch"; 
import Swal from "sweetalert2";

function Assigments() {
  const [loading, setLoading] = useState(false);
  const [listas, setListas] = useState({ rooms: [], sports: [], coaches: [] });
  const [form, setForm] = useState({ room_id: "", sport_id: "", coach_id: "" });

useEffect(() => {
  const fetchData = async () => {
    try {
      const [roomsRes, sportsRes, usersRes] = await Promise.all([
        authFetch('/rooms'),      
        authFetch('/sports'),     
        authFetch('/users')       
      ]);

      // Accedemos a .data, ya que el error indica que usersRes no es un array
      // Usamos '|| []' por seguridad si la estructura varía
      const usersList = usersRes.data || usersRes || [];
      
      // Ahora el filtro debería funcionar sobre el array correcto
      const coaches = usersList.filter(user => user.role === 'coach');

      setListas({ 
        rooms: roomsRes.data || roomsRes || [], 
        sports: sportsRes.data || sportsRes || [], 
        coaches: coaches 
      });
    } catch (error) {
      console.error("Error al cargar:", error);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };
  fetchData();
}, []);

const handleAssign = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // El payload debe contener sport_id, room_id y coach_id
    await authFetch("/api/sport-rooms", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form) 
    });
    Swal.fire("¡Éxito!", "Asignación creada correctamente", "success");
  } catch (err) {
    Swal.fire("Error", "No se pudo realizar la asignación", "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4">Gestión de Sport</h3> {/* Título actualizado */}
      <Form onSubmit={handleAssign} className="p-4 border rounded shadow-sm">
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Sala</Form.Label>
          <Form.Select onChange={(e) => setForm({...form, room_id: e.target.value})} required>
            <option value="">Seleccione una sala</option>
            {listas.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Deporte</Form.Label>
          <Form.Select onChange={(e) => setForm({...form, sport_id: e.target.value})} required>
            <option value="">Seleccione un deporte</option>
            {listas.sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Coach</Form.Label>
        <Form.Select onChange={(e) => setForm({...form, coach_id: e.target.value})} required>
            <option value="">Seleccione un coach</option>
            {listas.coaches.map(c => (
            <option key={c.id} value={c.id}>
                {c.full_name} {/* Aquí estaba el error, usa full_name según el modelo de datos */}
            </option>
            ))}
        </Form.Select>
        </Form.Group>

        <Button type="submit" className="w-100" style={{ backgroundColor: '#ff9100', border: 'none' }} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Guardar Sport"}
        </Button>
      </Form>
    </Container>
  );
}

export default Assigments;