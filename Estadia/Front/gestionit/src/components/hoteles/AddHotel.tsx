import axios from "axios";
import { useState } from "react";
import "../../styles/ModalAddEdit.css"

interface AddHotelProps {
  isOpen: boolean;
  onClose: () => void;
  onHotelAdded: () => void;
}

const AddHotel = ({ isOpen, onClose, onHotelAdded }: AddHotelProps) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/hoteles", formData);
      onHotelAdded();
      setFormData({ name: "" });
      onClose();
    } catch (error) {
      console.error("Error al agregar el hotel: ", error);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Hotel</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="button-group">
            <button className="cancel-button" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="submit-button">Agregar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHotel;
