import { useEffect, useState } from "react";
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import UserFormModal from "../../components/users/UserFormModal";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../services/userService";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data.data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
        Swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
      } else {
        await createUser(formData);
        Swal.fire("Creado", "Usuario creado correctamente", "success");
      }
      closeModal();
      loadUsers();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${user.full_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id);
        Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
        loadUsers();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 
          className="mb-0" 
          style={{ fontSize: '1.4rem', color: '#515151' }}
        >
          Gestión de Usuarios
        </h2>
        <Button 
          onClick={openCreateModal}
          className="fw-bold btn-sm px-3 py-2"
          style={{ 
            backgroundColor: '#ff7c2a', 
            borderColor: '#ffbb00', 
            fontSize: '0.7rem', 
            color: '#ffffff' 
          }}
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <Card className="shadow-sm">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === "admin" ? "danger" : "info"}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2" 
                      onClick={() => openEditModal(user)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(user)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      <UserFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedUser={selectedUser}
      />
    </div>
  );
}

export default UsersPage;