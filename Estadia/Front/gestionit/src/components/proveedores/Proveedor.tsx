import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Tabla.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteConfirmationModal from "../Extras/DeleteModal";
import AddProveedor from "./AddProveedor";
import EditProveedor from "./EditProveedor";

interface AssignmentItem {
  idProveedor: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  rfc: string;
}

const Proveedor = () => {
  const [proveedors, setProveedors] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProveedors, setSelectedProveedors] = useState<string | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingProveedorId, setEditingProveedorId] = useState<string | null>(
    null
  );

  const fecthProveedors = async () => {
    try {
      const response = await axios.get("http://localhost:3001/proveedores");
      setProveedors(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching Proveedores");
      setLoading(false);
    }
  };

  useEffect(() => {
    fecthProveedors();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedProveedors(id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProveedors) {
      try {
        await axios.delete(
          `http://localhost:3001/proveedores/${selectedProveedors}`
        );
        setProveedors(
          proveedors.filter(
            (proveedors) => proveedors.idProveedor !== selectedProveedors
          )
        );
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al eliminar el proveedor", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProveedors(null);
  };

  const handleEditClick = (idProveedor: string) => {
    setEditingProveedorId(idProveedor);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsAddModalOpen(false);
    setEditingProveedorId(null);
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
              <h2>Proveedores</h2>
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
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Email</th>
                    <th>RFC</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedors.map((proveedor) => (
                    <tr key={proveedor.idProveedor}>
                      <td>{proveedor.name}</td>
                      <td>{proveedor.phone}</td>
                      <td>{proveedor.address}</td>
                      <td>{proveedor.email}</td>
                      <td>{proveedor.rfc}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn yellow"
                            onClick={() =>
                              handleEditClick(proveedor.idProveedor)
                            }
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="action-btn red"
                            onClick={() =>
                              handleDeleteClick(proveedor.idProveedor)
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
      <AddProveedor
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProveedorAdded={fecthProveedors}
      />
      {editingProveedorId !== null && (
        <EditProveedor
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          idProveedor={editingProveedorId}
          onProveedorUpdated={fecthProveedors}
        />
      )}
    </div>
  );
};

export default Proveedor;
