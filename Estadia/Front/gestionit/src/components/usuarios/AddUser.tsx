import { useState } from "react";
import axios from "axios";
import "../../styles/ModalAddEdit.css";

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUser = ({ isOpen, onClose, onUserAdded }: AddUserProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    numberColaborador: "",
    companyname: "",
    roles: 1,
  });
  const token = localStorage.getItem("access_token");

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
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/usuario`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUserAdded();
      setFormData((prev) => ({
        ...prev,
        name: "",
        email: "",
        password: "",
        numberColaborador: "",
        companyname: "",
      }));
      onClose();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Usuario</h2>
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
            <label htmlFor="numberColaborador">Número de colaborador</label>
            <input
              type="text"
              id="numberColaborador"
              name="numberColaborador"
              value={formData.numberColaborador}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,8}$/.test(value)) {
                  handleInputChange(e);
                }
              }}
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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Nombre de la empresa</label>
            <input
              type="text"
              id="companyname"
              name="companyname"
              value={formData.companyname}
              onChange={handleInputChange}
              required
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
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
