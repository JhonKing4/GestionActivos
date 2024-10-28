import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Tabla.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteConfirmationModal from "../Extras/DeleteModal";
import AddProveedor from "./AddProveedor";
import EditProveedor from "./EditProveedor";
import Loader from "../Extras/loading";
import Pagination from "../Extras/pagination";
import NotFound from "../Extras/Not Found";

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
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("access_token");

  const fecthProveedors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/proveedores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
          `${process.env.REACT_APP_API_URL}/proveedores/${selectedProveedors}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fecthProveedors();
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      fecthProveedors();
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/proveedores/search/${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        if (response.data.length > 0) {
          setProveedors(response.data);
        } else {
          setProveedors([]);
        }
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setProveedors([]);
      } else {
        setError("Error fetching search results");
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProveedor = proveedors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(proveedors.length / itemsPerPage);

  if (loading) return <Loader />;
  if (error) return <NotFound/>;

  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header />
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Proveedores</h2>
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
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Email</th>
                    <th>RFC</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProveedor.length > 0 ? (
                    currentProveedor.map((proveedor) => (
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
