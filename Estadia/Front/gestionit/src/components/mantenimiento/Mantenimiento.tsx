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
import Pagination from "../Extras/pagination";
import NotFound from "../Extras/Not Found";

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
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("access_token");

  const fetchMaintenance = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/mantenimiento`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
          `${process.env.REACT_APP_API_URL}/mantenimiento/${selectedMaintenance}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchMaintenance();
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      fetchMaintenance();
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/mantenimiento/search/${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        if (response.data.length > 0) {
          setMaintenanceData(response.data);
        } else {
          setMaintenanceData([]);
        }
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setMaintenanceData([]);
      } else {
        setError("Error fetching search results");
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMantenimiento = maintenanceData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(maintenanceData.length / itemsPerPage);

  if (loading) return <Loader />;
  if (error) return <NotFound/>;

  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header/>
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Mantenimientos</h2>
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
                  {currentMantenimiento.length > 0 ? (
                    currentMantenimiento.map((item) => (
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
