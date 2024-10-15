import axios from "axios";
import { useState, useEffect } from "react";
import "../../styles/AssignmentModal.css";

interface AddAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentAdded: () => void;
}

const AddAssignment = ({
  isOpen,
  onClose,
  onAssignmentAdded,
}: AddAssignmentProps) => {
  const [formData, setFormData] = useState({
    assignmentDate: "",
    returnDate: "",
    observation: "",
    statusAsig: 0,
    materialId: [] as string[],
    usuarioId: "",
    departamentoId: "",
    hotelId: "",
  });

  const [materials, setMaterials] = useState<any[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterialsAndAssignments = async () => {
    try {
      const materialResponse = await axios.get(
        "http://localhost:3001/material"
      );
      const assignmentResponse = await axios.get(
        "http://localhost:3001/asignacion"
      );

      const allMaterials = materialResponse.data;
      const assignedMaterials = assignmentResponse.data.flatMap(
        (asignacion: any) => asignacion.material.map((m: any) => m.idMaterial)
      );

      const filteredMaterials = allMaterials.filter(
        (material: any) => !assignedMaterials.includes(material.idMaterial)
      );

      setMaterials(allMaterials);
      setAvailableMaterials(filteredMaterials);
    } catch (error) {
      console.error("Error al obtener materiales o asignaciones:", error);
    }
  };

  const fetchAdditionalData = async () => {
    try {
      const userResponse = await axios.get("http://localhost:3001/usuario");
      const departmentResponse = await axios.get(
        "http://localhost:3001/departamentos"
      );
      const hotelResponse = await axios.get("http://localhost:3001/hoteles");

      setUsers(userResponse.data);
      setDepartments(departmentResponse.data);
      setHotels(hotelResponse.data);
    } catch (error) {
      console.error(
        "Error al obtener usuarios, departamentos o hoteles:",
        error
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMaterialsAndAssignments();
      fetchAdditionalData();
      setLoading(false);
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "statusAsig" ? Number(value) : value,
    }));
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newMaterials = checked
        ? [...prev.materialId, value]
        : prev.materialId.filter((id) => id !== value);
      return { ...prev, materialId: newMaterials };
    });
  };

  const resetForm = () => {
    setFormData({
      assignmentDate: "",
      returnDate: "",
      observation: "",
      statusAsig: 0,
      materialId: [],
      usuarioId: "",
      departamentoId: "",
      hotelId: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/asignacion", formData);
      onAssignmentAdded();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creando asignación:", error);
    }
  };

  if (!isOpen || loading) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Asignación</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="assignmentDate">Fecha de Asignación</label>
                <input
                  type="date"
                  id="assignmentDate"
                  name="assignmentDate"
                  value={formData.assignmentDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="returnDate">Fecha de Devolución</label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="observation">Observación</label>
                <input
                  type="text"
                  id="observation"
                  name="observation"
                  value={formData.observation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="statusAsig">Estado</label>
                <select
                  id="statusAsig"
                  name="statusAsig"
                  value={formData.statusAsig}
                  onChange={handleInputChange}
                  required
                >
                  <option value={0}>Activa</option>
                  <option value={1}>Completado</option>
                  <option value={2}>Pendiente</option>
                  <option value={3}>Cancelada</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="usuarioId">Usuario</label>
                <select
                  id="usuarioId"
                  name="usuarioId"
                  value={formData.usuarioId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar usuario</option>
                  {users.map((user) => (
                    <option key={user.idUsuario} value={user.idUsuario}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="departamentoId">Departamento</label>
                <select
                  id="departamentoId"
                  name="departamentoId"
                  value={formData.departamentoId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar departamento</option>
                  {departments.map((department) => (
                    <option
                      key={department.idDepartamento}
                      value={department.idDepartamento}
                    >
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="hotelId">Hotel</label>
                <select
                  id="hotelId"
                  name="hotelId"
                  value={formData.hotelId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.idHotel} value={hotel.idHotel}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="materials-section">
              <h3>Materiales Disponibles</h3>
              <div className="checkbox-group">
                {availableMaterials.length > 0 ? (
                  availableMaterials.map((material) => (
                    <div className="checkbox-item" key={material.idMaterial}>
                      <input
                        type="checkbox"
                        id={`material-${material.idMaterial}`}
                        value={material.idMaterial}
                        onChange={handleMaterialChange}
                      />
                      <label htmlFor={`material-${material.idMaterial}`}>
                        {material.name} - {material.serial_number}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No hay materiales disponibles</p>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="cancel-button" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="submit-button" type="submit">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignment;
