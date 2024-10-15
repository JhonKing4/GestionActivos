import axios from "axios";
import { useEffect, useState } from "react";
import Side from "../Extras/sidebar";
import Header from "../Extras/header";
import { Download, Pencil, Trash2 } from "lucide-react";
import "../../styles/Tabla.css";
import DeleteConfirmationModal from "../Extras/DeleteModal";
import AddAssignment from "./AddAsignacion";
import EditAssignment from "./EditAsignacion";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const totalPages = Math.ceil(assignmentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = assignmentData.slice(startIndex, endIndex);

  const fetchAssigment = async () => {
    try {
      const response = await axios.get("http://localhost:3001/asignacion");
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
          `http://localhost:3001/asignacion/${selectedAssigment}`
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

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) return <p>Cargando ...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header userName="Jhoandi" />
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Asignación</h2>
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
                  {paginatedData.map((item) => (
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
                          <button className="action-btn">
                            <Download size={18} />
                          </button>
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
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`page-btn ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="page-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
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
