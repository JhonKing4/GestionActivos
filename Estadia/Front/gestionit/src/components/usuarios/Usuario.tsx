import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Tabla.css";
import DeleteConfirmationModal from "../Extras/DeleteModal";
import AddUser from "./AddUser";
import EditUser from "./EditUser";

interface AssignmentItem {
  idUsuario: string;
  name: string;
  email: string;
  password: string;
  roles: number;
}

const Usuario = () => {
  const [users, setUsers] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/usuario");
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedUser(id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`http://localhost:3001/usuario/${selectedUser}`);
        setUsers(users.filter((user) => user.idUsuario !== selectedUser));
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditClick = (idUsuario: string) => {
    setEditingUserId(idUsuario);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingUserId(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header userName="Jhoandi" />
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Usuarios</h2>
              <button
                className="add-button"
                onClick={() => setIsAddModalOpen(true)}
              >
                Agregar
              </button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Contraseña</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.idUsuario}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                      <td>{user.roles === 0 ? "Admin" : "Colaborador"}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn yellow"
                            onClick={() => handleEditClick(user.idUsuario)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="action-btn red"
                            onClick={() => handleDeleteClick(user.idUsuario)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <div className="showing-entries">
                <span>Showing</span>
                <select defaultValue="10">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </select>
              </div>
              <div className="pagination">
                <button className="page-btn">←</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
      />
      <AddUser
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={fetchUsers}
      />
      {editingUserId !== null && (
        <EditUser
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          userId={editingUserId}
          onUserUpdated={fetchUsers}
        />
      )}
    </div>
  );
};

export default Usuario;
