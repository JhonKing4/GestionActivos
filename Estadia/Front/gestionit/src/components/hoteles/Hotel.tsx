import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Tabla.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteConfirmationModal from "../Extras/DeleteModal";
import AddHotel from "./AddHotel";
import EditHotel from "./EditHotel";
import Loader from "../Extras/loading";
import Pagination from "../Extras/pagination";
import NotFound from "../Extras/Not Found";

interface AssignmentItem {
  idHotel: string;
  name: string;
}

const Hotel = () => {
  const [hotels, setHotels] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("access_token");

  const fetchHotels = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/hoteles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHotels(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching hoteles");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedHotel(id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedHotel) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/hoteles/${selectedHotel}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHotels(hotels.filter((hotel) => hotel.idHotel !== selectedHotel));
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al eliminar el Hotel", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
  };

  const handleEditClick = (idHotel: string) => {
    setEditingHotelId(idHotel);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingHotelId(null);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchHotels();
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      fetchHotels();
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/hoteles/name/${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        if (response.data.length > 0) {
          setHotels(response.data);
        } else {
          setHotels([]);
        }
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setHotels([]);
      } else {
        setError("Error fetching search results");
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHotels = hotels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(hotels.length / itemsPerPage);

  if (loading) return <Loader />;
  if (error) return <NotFound />;

  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header/>
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Hoteles</h2>
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
                  {currentHotels.length > 0 ? (
                    currentHotels.map((hotel) => (
                      <tr key={hotel.idHotel}>
                        <td>{hotel.name}</td>
                        <td>
                          <div className="action-buttons">
                            <div
                              className="action-btn yellow"
                              onClick={() => handleEditClick(hotel.idHotel)}
                            >
                              <Pencil size={18} />
                            </div>
                            <div
                              className="action-btn red"
                              onClick={() => handleDeleteClick(hotel.idHotel)}
                            >
                              <Trash2 size={18} />
                            </div>
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
      <AddHotel
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onHotelAdded={fetchHotels}
      />
      {editingHotelId !== null && (
        <EditHotel
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          idHotel={editingHotelId}
          onHotelUpdated={fetchHotels}
        />
      )}
    </div>
  );
};

export default Hotel;
