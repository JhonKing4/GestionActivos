import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Tabla.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteConfirmationModal from "../Extras/DeleteModal";
import AddHotel from "./AddHotel";
import EditHotel from "./EditHotel";

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

  const fetchHotels = async () => {
    try {
      const response = await axios.get("http://localhost:3001/hoteles");
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
        await axios.delete(`http://localhost:3001/hoteles/${selectedHotel}`);
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
              <h2>Hoteles</h2>
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
                  {hotels.map((hotel) => (
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
