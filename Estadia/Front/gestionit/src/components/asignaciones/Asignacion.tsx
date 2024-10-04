import axios from "axios";
import { useEffect, useState } from "react";
import Side from "../Extras/sidebar";
import Header from "../Extras/header";
import { Download, Pencil, Trash2 } from "lucide-react";
import "../../styles/Tabla.css";
import DeleteConfirmationModal from "../Extras/DeleteModal";

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

  useEffect(() => {
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
              <button className="add-button">Agregar</button>
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
                  {assignmentData.map((item) => (
                    <tr key={item.idAsignacion}>
                      <td>
                        {item.material &&
                        Array.isArray(item.material) &&
                        item.material.length > 0
                          ? item.material
                              .map((mat) =>
                                mat && mat.name ? mat.name : "Sin nombre"
                              )
                              .join(", ")
                          : "No Material"}
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
                          <button className="action-btn yellow">
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
              <div className="showing-entries">
                <span>Mostrando</span>
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
    </div>
  );
};

export default Asignacion;
