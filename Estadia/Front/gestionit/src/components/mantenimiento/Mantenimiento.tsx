import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Tabla.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteConfirmationModal from "../Extras/DeleteModal";
import AddMaintenance from "./AddMantenimiento";
import EditMaintenance from "./EditMantenimiento";
import Loader from "../Extras/loading";

interface Material {
  idMaterial: string;
  name: string;
  model: string;
  serial_number: string;
}

interface MaintenanceItem {
  idMantenimiento: string;
  description: string;
  startDate: string;
  endDate: string;
  typeMaintenance: number;
  materials: Material[];
}

const Mantenimiento = () => {
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<string | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingMantenimientoId, setEditingMantenimientoId] = useState<
    string | null
  >(null);

  const fetchMaintenance = async () => {
    try {
      const response = await axios.get("http://localhost:3001/mantenimiento");
      setMaintenanceData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error al obtener los mantenimientos");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedMaintenance(id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedMaintenance) {
      try {
        await axios.delete(
          `http://localhost:3001/mantenimiento/${selectedMaintenance}`
        );
        setMaintenanceData(
          maintenanceData.filter(
            (maintenance) => maintenance.idMantenimiento !== selectedMaintenance
          )
        );
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al eliminar el mantenimiento", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMaintenance(null);
  };

  const handleEditClick = (idMantenimiento: string) => {
    setEditingMantenimientoId(idMantenimiento);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingMantenimientoId(null);
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
              <h2>Mantenimientos</h2>
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
                    <th>Material</th>
                    <th>Numero de serie</th>
                    <th>Descripción</th>
                    <th>Tipo de mantenimiento</th>
                    <th>Fecha de Inicio</th>
                    <th>Fecha de finalización</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceData.map((item) => (
                    <tr key={item.idMantenimiento}>
                      <td>
                        {item.materials.map((material) => (
                          <p key={material.idMaterial}>{material.name}</p>
                        ))}
                      </td>
                      <td>
                        {item.materials.map((material) => (
                          <p key={material.idMaterial}>
                            {material.serial_number}
                          </p>
                        ))}
                      </td>
                      <td>{item.description}</td>
                      <td>
                        {item.typeMaintenance === 0
                          ? "Correctivo"
                          : "Preventivo"}
                      </td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn yellow"
                            onClick={() =>
                              handleEditClick(item.idMantenimiento)
                            }
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="action-btn red"
                            onClick={() =>
                              handleDeleteClick(item.idMantenimiento)
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
      <AddMaintenance
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMaintenanceAdded={fetchMaintenance}
      />
      {editingMantenimientoId !== null && (
        <EditMaintenance
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          idMantenimiento={editingMantenimientoId}
          onMaintenanceUpdated={fetchMaintenance}
        />
      )}
    </div>
  );
};

export default Mantenimiento;
