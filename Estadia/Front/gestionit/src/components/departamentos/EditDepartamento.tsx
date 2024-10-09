import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/ModalAddEdit.css";

interface EditDepartamentoProps {
  isOpen: boolean;
  onClose: () => void;
  idDepartamento: string;
  onDepartamentoUpdated: () => void;
}

const EditDepartamento = ({
  isOpen,
  onClose,
  idDepartamento,
  onDepartamentoUpdated,
}: EditDepartamentoProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  useEffect(() => {
    const fetchDepartamentoData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/departamentos/${idDepartamento}`
        );
        setFormData({
          name: response.data.name,
          description: response.data.description,
        });
      } catch (error) {
        console.error("Error fetching departamento data: ", error);
      }
    };

    if (isOpen) {
      fetchDepartamentoData();
    }
  }, [isOpen, idDepartamento]);

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

    const updatedData = {
      name: formData.name,
      description:
        formData.description.trim() === "" ? " " : formData.description,
    };

    try {
      await axios.patch(
        `http://localhost:3001/departamentos/${idDepartamento}`,
        updatedData
      );
      onDepartamentoUpdated();
      onClose();
    } catch (error) {
      console.error("Error al editar el departamento: ", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Departamento</h2>
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
            <label htmlFor="name">Descripción</label>
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
            <button className="submit-button" type="submit">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartamento;
