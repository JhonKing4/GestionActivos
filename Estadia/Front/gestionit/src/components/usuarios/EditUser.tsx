import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ModalAddEdit.css";

interface EditUserProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onUserUpdated: () => void;
}

const EditUser = ({
  isOpen,
  onClose,
  userId,
  onUserUpdated,
}: EditUserProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    numberColaborador: "",
    roles: 1,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/usuario/${userId}`
        );
        setFormData({
          name: response.data.name,
          email: response.data.email,
          password: "",
          numberColaborador: response.data.numberColaborador,
          roles: response.data.roles,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen, userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "roles" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = {
      name: formData.name,
      email: formData.email,
      numberColaborador: formData.numberColaborador,
      roles: formData.roles,
    };

    try {
      await axios.patch(`http://localhost:3001/usuario/${userId}`, updatedData);
      onUserUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Usuario</h2>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="numberColaborador">Numero de Colaborador</label>
            <input
              type="number"
              id="numberColaborador"
              name="numberColaborador"
              value={formData.numberColaborador}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>

          <div className="form-group">
            <label htmlFor="roles">Rol</label>
            <select
              id="roles"
              name="roles"
              value={formData.roles}
              onChange={handleInputChange}
            >
              <option value={0}>Admin</option>
              <option value={1}>Colaborador</option>
            </select>
          </div>

          <div className="button-group">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
