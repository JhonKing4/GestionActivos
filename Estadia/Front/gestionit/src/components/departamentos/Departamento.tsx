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

interface AssignmentItem {
  idDepartamento: string;
  name: string;
  description: string;
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

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/departamentos");
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
          `http://localhost:3001/departamentos/${selectedDepartament}`
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
              <h2>Departamentos</h2>
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
                    <th>Descripción</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departamentos.map((departamento) => (
                    <tr key={departamento.idDepartamento}>
                      <td>{departamento.name}</td>
                      <td>{departamento.description}</td>
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
