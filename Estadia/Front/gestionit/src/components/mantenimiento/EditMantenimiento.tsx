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
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  const fetchMaintenanceData = async () => {
    try {
      const [maintenanceResponse, materialResponse, maintenancesResponse] =
        await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/mantenimiento/${idMantenimiento}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/material`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/mantenimiento`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const maintenanceData = maintenanceResponse.data?.data || {};
      const allMaterials = materialResponse.data || [];
      const allMaintenances = maintenancesResponse.data || [];

      const usedMaterials = allMaintenances.flatMap((mantenimiento: any) =>
        mantenimiento.materials.map((m: any) => m.idMaterial)
      );

      console.log(
        "Materiales utilizados en otros mantenimientos:",
        usedMaterials
      );

      const availableMaterials = allMaterials.filter(
        (material: any) => !usedMaterials.includes(material.idMaterial)
      );

      const materialsInMaintenance = maintenanceData.materials.map(
        (m: any) => m.idMaterial
      );
      const filteredMaterials = [
        ...availableMaterials,
        ...allMaterials.filter((material: any) =>
          materialsInMaintenance.includes(material.idMaterial)
        ),
      ];

      console.log(
        "Materiales filtrados (disponibles + asignados):",
        filteredMaterials
      );

      setFormData({
        description: maintenanceData.description,
        startDate: maintenanceData.startDate,
        endDate: maintenanceData.endDate,
        typeMaintenance: maintenanceData.typeMaintenance,
        materials: materialsInMaintenance,
      });

      setAvailableMaterials(filteredMaterials);
      allMaterials(allMaterials);
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
        `${process.env.REACT_APP_API_URL}/mantenimiento/${idMantenimiento}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
