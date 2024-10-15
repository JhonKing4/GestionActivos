import axios from "axios";
import { useState, useEffect } from "react";
import "../../styles/AssignmentModal.css";

interface EditAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentUpdated: () => void;
  assignmentId: string;
}

const EditAssignment = ({
  isOpen,
  onClose,
  onAssignmentUpdated,
  assignmentId,
}: EditAssignmentProps) => {
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

  const fetchAssignment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/asignacion/${assignmentId}`
      );
      const assignmentData = response.data;

      setFormData({
        assignmentDate: assignmentData.assignmentDate,
        returnDate: assignmentData.returnDate,
        observation: assignmentData.observation,
        statusAsig: assignmentData.statusAsig,
        materialId: assignmentData.material.map((m: any) => m.idMaterial),
        usuarioId: assignmentData.usuario.idUsuario,
        departamentoId: assignmentData.departamento.idDepartamento,
        hotelId: assignmentData.hotel.idHotel,
      });
    } catch (error) {
      console.error("Error al cargar la asignación:", error);
    }
  };

  const fetchMaterialsAndAssignments = async () => {
    try {
      const materialResponse = await axios.get(
        "http://localhost:3001/material"
      );
      const assignmentsResponse = await axios.get(
        "http://localhost:3001/asignacion"
      );

      const allMaterials = materialResponse.data;

      const assignedMaterialsInOtherAssignments = assignmentsResponse.data
        .filter((assignment: any) => assignment.idAsignacion !== assignmentId) // Excluimos la asignación actual
        .flatMap((assignment: any) =>
          assignment.material.map((m: any) => m.idMaterial)
        );

      const assignmentResponse = await axios.get(
        `http://localhost:3001/asignacion/${assignmentId}`
      );
      const assignedMaterials = assignmentResponse.data.material.map(
        (m: any) => m.idMaterial
      );

      const filteredMaterials = allMaterials.filter((material: any) => {
        const isAssignedToOtherActiveAssignments =
          assignedMaterialsInOtherAssignments.includes(material.idMaterial);
        const isAssignedToCurrentAssignment = assignedMaterials.includes(
          material.idMaterial
        );

        return (
          (material.stock > 0 && !isAssignedToOtherActiveAssignments) ||
          isAssignedToCurrentAssignment
        );
      });

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
      const loadData = async () => {
        await fetchAssignment();
        await fetchMaterialsAndAssignments();
        await fetchAdditionalData();
        setLoading(false);
      };
      loadData();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:3001/asignacion/${assignmentId}`,
        formData
      );

      await fetchMaterialsAndAssignments();

      onAssignmentUpdated();
      onClose();
    } catch (error) {
      console.error("Error actualizando asignación:", error);
    }
  };

  if (!isOpen || loading) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Asignación</h2>
          <button className="close-button" onClick={onClose}>
            ×
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
                {availableMaterials.map((material) => (
                  <div key={material.idMaterial} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`material-${material.idMaterial}`}
                      value={material.idMaterial}
                      checked={formData.materialId.includes(
                        material.idMaterial
                      )}
                      onChange={handleMaterialChange}
                    />
                    <label htmlFor={`material-${material.idMaterial}`}>
                      {material.name} - {material.serial_number}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
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

export default EditAssignment;
