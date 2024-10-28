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
  });
  const token = localStorage.getItem("access_token");
  useEffect(() => {
    const fetchDepartamentoData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/departamentos/${idDepartamento}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData({
          name: response.data.name,
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
    };

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/departamentos/${idDepartamento}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
