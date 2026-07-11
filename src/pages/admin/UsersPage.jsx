import { useEffect, useState } from "react";
import { Badge, Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import UserFormModal from "../../components/users/UserFormModal";
import PageLoader from "../../components/PageLoader";
import EmptyTableRow from "../../components/EmptyTableRow";
import TableCard from "../../components/TableCard";
import ActionButtons from "../../components/ActionButtons";
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

  if (loading) {
    return <PageLoader message="Cargando usuarios..." />;
  }

  return (
    <>
      <TableCard title="Gestión de Usuarios" actionLabel="+ Nuevo Usuario" onAction={openCreateModal}>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr className="text-muted" style={{ fontSize: "0.8rem" }}>
              <th className="ps-3 py-2">Usuario</th>
              <th className="py-2">Correo</th>
              <th className="py-2">Rol</th>
              <th className="py-2">Fecha de Nacimiento</th>
              <th className="pe-3 py-2 text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="ps-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: "rgba(255,124,42,0.15)",
                          color: "#ff7c2a",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        {user.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-semibold">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="text-muted">{user.email}</td>
                  <td>
                    <Badge bg={user.role === "admin" ? "danger" : "info"}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="text-muted">{user.birth_date || "-"}</td>
                  <td className="pe-3">
                    <ActionButtons
                      onEdit={() => openEditModal(user)}
                      onDelete={() => handleDelete(user)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <EmptyTableRow colSpan={5} message="No hay usuarios registrados." />
            )}
          </tbody>
        </Table>
      </TableCard>

      <UserFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedUser={selectedUser}
      />
    </>
  );
}

export default UsersPage;