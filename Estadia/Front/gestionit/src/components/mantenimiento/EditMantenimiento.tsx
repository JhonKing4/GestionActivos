import axios from "axios";
import { useState, useEffect } from "react";
import "../../styles/ModalAddEdit.css";

interface EditMaintenanceProps {
  isOpen: boolean;
  onClose: () => void;
  onMaintenanceUpdated: () => void;
  idMantenimiento: string;
}

enum TypeMaintenance {
  Correctivo = 0,
  Preventivo = 1,
}

const EditMaintenance = ({
  isOpen,
  onClose,
  onMaintenanceUpdated,
  idMantenimiento,
}: EditMaintenanceProps) => {
  const [formData, setFormData] = useState({
    description: "",
    startDate: "",
    endDate: "",
    typeMaintenance: TypeMaintenance.Correctivo,
    materials: [] as string[],
  });

  const [availableMaterials, setAvailableMaterials] = useState<any[]>([]);
  const [allMaterials, setAllMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaintenanceData = async () => {
    try {
      const maintenanceResponse = await axios.get(
        `http://localhost:3001/mantenimiento/${idMantenimiento}`
      );
      const maintenanceData = maintenanceResponse.data;
      console.log("Datos del mantenimiento:", maintenanceData);

      const materialResponse = await axios.get(
        "http://localhost:3001/material"
      );
      const allMaterials = materialResponse.data;
      console.log("Todos los materiales:", allMaterials);

      const maintenancesResponse = await axios.get(
        "http://localhost:3001/mantenimiento"
      );
      const usedMaterials = maintenancesResponse.data.flatMap(
        (mantenimiento: any) =>
          mantenimiento.materials.map((m: any) => m.idMaterial)
      );

      console.log(
        "Materiales utilizados en otros mantenimientos:",
        usedMaterials
      );

      const filteredMaterials = allMaterials.filter(
        (material: any) =>
          !usedMaterials.includes(material.idMaterial) ||
          maintenanceData.materials.includes(material.idMaterial)
      );

      console.log("Materiales filtrados:", filteredMaterials);

      setFormData({
        description: maintenanceData.description,
        startDate: maintenanceData.startDate,
        endDate: maintenanceData.endDate,
        typeMaintenance: maintenanceData.typeMaintenance,
        materials: maintenanceData.materials.map((m: any) => m.idMaterial),
      });

      setAllMaterials(allMaterials);
      setAvailableMaterials(filteredMaterials);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los datos del mantenimiento:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && idMantenimiento) {
      setLoading(true);
      fetchMaintenanceData();
    }
  }, [isOpen, idMantenimiento]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "typeMaintenance" ? Number(value) : value,
    }));
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newMaterials = checked
        ? [...prev.materials, value]
        : prev.materials.filter((material) => material !== value);
      return { ...prev, materials: newMaterials };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:3001/mantenimiento/${idMantenimiento}`,
        formData
      );
      onMaintenanceUpdated();
      onClose();
    } catch (error) {
      console.error("Error al actualizar el mantenimiento:", error);
    }
  };

  if (!isOpen || loading) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Mantenimiento</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Fecha de Inicio</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">Fecha de Fin</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="typeMaintenance">Tipo de Mantenimiento</label>
            <select
              id="typeMaintenance"
              name="typeMaintenance"
              value={formData.typeMaintenance}
              onChange={handleInputChange}
              required
            >
              <option value={TypeMaintenance.Correctivo}>Correctivo</option>
              <option value={TypeMaintenance.Preventivo}>Preventivo</option>
            </select>
          </div>
          <div className="form-group">
            <label>Materiales Disponibles</label>
            <div className="checkbox-group">
              {availableMaterials.length > 0 ? (
                availableMaterials.map((material) => (
                  <div key={material.idMaterial}>
                    <input
                      type="checkbox"
                      id={`material-${material.idMaterial}`}
                      value={material.idMaterial}
                      checked={formData.materials.includes(material.idMaterial)}
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
          <div className="button-group">
            <button className="cancel-button" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="submit-button">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaintenance;