import axios from "axios";
import { useEffect, useState } from "react";
import Side from "../Extras/sidebar";
import Header from "../Extras/header";
import { Pencil, Trash2 } from "lucide-react";
import "../../styles/Tabla.css";
import DeleteConfirmationModal from "../Extras/DeleteModal";
import AddAssignment from "./AddAsignacion";
import EditAssignment from "./EditAsignacion";
import { PDFDownloadButton } from "../Extras/Plantilla";
import Loader from "../Extras/loading";
import Pagination from "../Extras/pagination";

interface Material {
  idMaterial: string;
  name: string;
  serial_number: string;
}
interface Hotel {
  idHotel: string;
  name: string;
}
interface Department {
  idDepartamento: string;
  name: string;
  description: string;
}
interface User {
  idUsuario: string;
  name: string;
  email: string;
}
interface AssgmentItem {
  idAsignacion: string;
  assignmentDate: string;
  returnDate: string;
  observation: string;
  statusAsig: number;
  usuario: User;
  departamento: Department;
  hotel: Hotel;
  material: Material[];
}

const Asignacion = () => {
  const [assignmentData, setAssigmentData] = useState<AssgmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAssigment, setSelectedAssigment] = useState<string | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingAsignacionId, setEditingAsignacionId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("access_token");

  const fetchAssigment = async () => {
    try {
      const response = await axios.get("http://localhost:3001/asignacion", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssigmentData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error al obtener las asignaciones");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigment();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedAssigment(id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAssigment) {
      try {
        await axios.delete(
          `http://localhost:3001/asignacion/${selectedAssigment}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssigmentData(
          assignmentData.filter(
            (assignment) => assignment.idAsignacion !== selectedAssigment
          )
        );
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al eliminar la asignación", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAssigment(null);
  };

  const handleEditClick = (idAsignacion: string) => {
    setEditingAsignacionId(idAsignacion);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingAsignacionId(null);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchAssigment();
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      fetchAssigment();
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3001/asignacion/search/${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        if (response.data.length > 0) {
          setAssigmentData(response.data);
        } else {
          setAssigmentData([]);
        }
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setAssigmentData([]);
      } else {
        setError("Error fetching search results");
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssignments = assignmentData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(assignmentData.length / itemsPerPage);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header />
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Asignación</h2>
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
                    <th>Materiales</th>
                    <th>Colaborador</th>
                    <th>Departamento/Área</th>
                    <th>Fecha de Asignación</th>
                    <th>Fecha de entrega</th>
                    <th>Observación</th>
                    <th>Estado</th>
                    <th>Nombre de Hotel</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAssignments.map((item) => (
                    <tr key={item.idAsignacion}>
                      <td>
                        {item.material.map((material) => (
                          <p key={material.idMaterial}>{material.name}</p>
                        ))}
                      </td>
                      <td>{item.usuario.name}</td>
                      <td>{item.departamento.name}</td>
                      <td>{item.assignmentDate}</td>
                      <td>{item.returnDate}</td>
                      <td>{item.observation}</td>
                      <td>
                        {(() => {
                          switch (item.statusAsig) {
                            case 0:
                              return "Activa";
                            case 1:
                              return "Completada";
                            case 2:
                              return "Pendiente";
                            case 3:
                              return "Cancelada";
                            default:
                              return "Desconocido";
                          }
                        })()}
                      </td>
                      <td>{item.hotel.name}</td>
                      <td>
                        <div className="action-buttons">
                          <PDFDownloadButton assignmentId={item.idAsignacion} />
                          <button
                            className="action-btn yellow"
                            onClick={() => handleEditClick(item.idAsignacion)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="action-btn red"
                            onClick={() => handleDeleteClick(item.idAsignacion)}
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
      <AddAssignment
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAssignmentAdded={fetchAssigment}
      />
      {editingAsignacionId !== null && (
        <EditAssignment
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          assignmentId={editingAsignacionId}
          onAssignmentUpdated={fetchAssigment}
        />
      )}
    </div>
  );
};

export default Asignacion;
