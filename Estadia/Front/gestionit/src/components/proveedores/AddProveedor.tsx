import axios from "axios";
import { useState } from "react";
import "../../styles/ModalAddEdit.css"

interface AddProveedorProps {
  isOpen: boolean;
  onClose: () => void;
  onProveedorAdded: () => void;
}

const AddProveedor = ({
  isOpen,
  onClose,
  onProveedorAdded,
}: AddProveedorProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    rfc: "",
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
      await axios.post("http://localhost:3001/proveedores", formData);
      onProveedorAdded();
      setFormData({ name: "", phone: "", address: "", email: "", rfc: "" });
      onClose();
    } catch (error) {
      console.error("Error al agregar el proveedor: ", error);
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

          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              maxLength={10}
              title="Debe ingresar solo números y un máximo de 10 dígitos"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              title="Debe ingresar un correo electrónico válido" // Validación para el email
            />
          </div>

          <div className="form-group">
            <label htmlFor="rfc">RFC</label>
            <input
              type="text"
              id="rfc"
              name="rfc"
              value={formData.rfc}
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

export default AddProveedor;
