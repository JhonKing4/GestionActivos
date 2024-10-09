import axios from "axios";
import { useState, useEffect } from "react";
import "../../styles/ModalAddEdit.css";

interface AddMaintenanceProps {
  isOpen: boolean;
  onClose: () => void;
  onMaintenanceAdded: () => void;
}

enum TypeMaintenance {
  Correctivo = 0,
  Preventivo = 1,
}

const AddMaintenance = ({
  isOpen,
  onClose,
  onMaintenanceAdded,
}: AddMaintenanceProps) => {
  const [formData, setFormData] = useState({
    description: "",
    startDate: "",
    endDate: "",
    typeMaintenance: TypeMaintenance.Correctivo,
    materials: [] as string[],
  });

  const [materials, setMaterials] = useState<any[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<any[]>([]);

  const fetchMaterials = async () => {
    try {
      const materialResponse = await axios.get(
        "http://localhost:3001/material"
      );
      const maintenanceResponse = await axios.get(
        "http://localhost:3001/mantenimiento"
      );

      const allMaterials = materialResponse.data;
      const usedMaterials = maintenanceResponse.data.flatMap(
        (mantenimiento: any) =>
          mantenimiento.materials.map((m: any) => m.idMaterial)
      );

      const filteredMaterials = allMaterials.filter(
        (material: any) => !usedMaterials.includes(material.idMaterial)
      );

      setMaterials(allMaterials);
      setAvailableMaterials(filteredMaterials);
    } catch (error) {
      console.error("Error al obtener materiales o mantenimientos:", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

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
      await axios.post("http://localhost:3001/mantenimiento", formData);
      onMaintenanceAdded();
      setFormData({
        description: "",
        startDate: "",
        endDate: "",
        typeMaintenance: TypeMaintenance.Correctivo,
        materials: [],
      });

      await fetchMaterials();

      onClose();
    } catch (error) {
      console.error("Error al agregar el mantenimiento:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Mantenimiento</h2>
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
            <button className="submit-button">Agregar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenance;
