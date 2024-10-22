import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Tabla.css";
import DeleteConfirmationModal from "../Extras/DeleteModal";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import Loader from "../Extras/loading";
import Pagination from "../Extras/pagination";

interface AssignmentItem {
  idUsuario: string;
  name: string;
  email: string;
  password: string;
  numberColaborador: string;
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
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(10);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const fetchUsers = async (term: string = "") => {
    try {
      const response = term
        ? await axios.get(`http://localhost:3001/usuario/search/${term}`)
        : await axios.get("http://localhost:3001/usuario");
      setUsers(response.data || []);
      setLoading(false);
    } catch (err) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchUsers();
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    fetchUsers(searchTerm);
  };

  const handleEditClick = (idUsuario: string) => {
    setEditingUserId(idUsuario);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingUserId(null);
  };

  if (loading) return <Loader />;
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
              <div className="search-group">
                <svg
                  className="search-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <g>
                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                  </g>
                </svg>
                <input
                  placeholder="Search"
                  type="search"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="searchs-button" onClick={handleSearch}>
                  Buscar
                </button>
              </div>
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
                    <th>Numero de Colaborador</th>
                    <th>Contraseña</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user.idUsuario}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.numberColaborador}</td>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>
                        No se encontraron resultados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="table-footer">
                <div className="showing-entries"></div>
                <div className="pagination">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
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
