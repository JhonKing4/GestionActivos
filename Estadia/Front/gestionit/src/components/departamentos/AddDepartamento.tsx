import axios from "axios";
import { useState } from "react";
import "../../styles/ModalAddEdit.css";

interface AddDepartamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onDepartamentoAdded: () => void;
}

const AddDepartamento = ({
  isOpen,
  onClose,
  onDepartamentoAdded,
}: AddDepartamentoProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
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

    const formDataWithDefaults = {
      ...formData,
      description:
        formData.description.trim() === "" ? " " : formData.description,
    };

    try {
      await axios.post(
        "http://localhost:3001/departamentos",
        formDataWithDefaults
      );
      onDepartamentoAdded();
      setFormData({ name: "", description: "" });
      onClose();
    } catch (error) {
      console.error("Error al agregar el departamento: ", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Departamento</h2>
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
            <label htmlFor="description">Descripción</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
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

export default AddDepartamento;