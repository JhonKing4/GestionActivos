import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Sidebar.css";
import "../../styles/Tabla.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteConfirmationModal from "../Extras/DeleteModal";
import AddDepartamento from "./AddDepartamento";
import EditDepartamento from "./EditDepartamento";
import Loader from "../Extras/loading";
import Pagination from "../Extras/pagination";
import NotFound from "../Extras/Not Found";

interface AssignmentItem {
  idDepartamento: string;
  name: string;
}

const Departamento = () => {
  const [departamentos, setDepartamentos] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDepartament, setSelectedDepartament] = useState<string | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingDepartamentoId, setEditingDepartamentoId] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("access_token");

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/departamentos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartamentos(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching Departamentos");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedDepartament(id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDepartament) {
      try {
        await axios.delete(
          `http://localhost:3001/departamentos/${selectedDepartament}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDepartamentos(
          departamentos.filter(
            (departamento) =>
              departamento.idDepartamento !== selectedDepartament
          )
        );
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al eliminar el departamento", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDepartament(null);
  };

  const handleEditClick = (idDepartamento: string) => {
    setEditingDepartamentoId(idDepartamento);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingDepartamentoId(null);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchDepartamentos();
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      fetchDepartamentos();
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3001/departamentos/name/${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        if (response.data.length > 0) {
          setDepartamentos(response.data);
        } else {
          setDepartamentos([]);
        }
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setDepartamentos([]);
      } else {
        setError("Error fetching search results");
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartamentos = departamentos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(departamentos.length / itemsPerPage);

  if (loading) return <Loader />;
  if (error) return <NotFound />;

  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header />
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Departamentos</h2>
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDepartamentos.length > 0 ? (
                    currentDepartamentos.map((departamento) => (
                      <tr key={departamento.idDepartamento}>
                        <td>{departamento.name}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn yellow"
                              onClick={() =>
                                handleEditClick(departamento.idDepartamento)
                              }
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              className="action-btn red"
                              onClick={() =>
                                handleDeleteClick(departamento.idDepartamento)
                              }
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
            </div>
            <div className="table-footer">
              <div className="showing-entries"></div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
      />
      <AddDepartamento
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDepartamentoAdded={fetchDepartamentos}
      />
      {editingDepartamentoId !== null && (
        <EditDepartamento
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          idDepartamento={editingDepartamentoId}
          onDepartamentoUpdated={fetchDepartamentos}
        />
      )}
    </div>
  );
};

export default Departamento;
