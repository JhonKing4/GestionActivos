import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../styles/EditMaterial.css";

interface EditMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: any;
  onUpdate: (updatedMaterialData: any) => void;
}

const EditMaterialModal: React.FC<EditMaterialModalProps> = ({
  isOpen,
  onClose,
  material,
  onUpdate,
}) => {
  const [updatedMaterial, setUpdatedMaterial] = useState<any>({ ...material });
  const [availableMaterials, setAvailableMaterials] = useState<any[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [hoteles, setHoteles] = useState<any[]>([]);
  const [allRelations, setAllRelations] = useState<any[]>([]);

  useEffect(() => {
    if (material && isOpen) {
      setUpdatedMaterial({
        ...material,
        idProveedor: material.idProveedor || "",
        idDepartamento: material.idDepartamento || "",
        idHotel: material.idHotel || "",
      });
      fetchAllData();
    }
  }, [material, isOpen]);

  const fetchAllData = async () => {
    try {
      const [
        materialsRes,
        relationsRes,
        proveedoresRes,
        departamentosRes,
        hotelesRes,
      ] = await Promise.all([
        axios.get("http://localhost:3001/material"),
        axios.get("http://localhost:3001/relacion-elements"),
        axios.get("http://localhost:3001/proveedores"),
        axios.get("http://localhost:3001/departamentos"),
        axios.get("http://localhost:3001/hoteles"),
      ]);

      const allMaterials = materialsRes.data;
      const relations = relationsRes.data;
      setAllRelations(relations);

      const materialsInRelations = new Set(
        relations.flatMap((rel: any) => [
          rel.materialPadre.idMaterial,
          ...rel.materialesHijos.map((hijo: any) => hijo.idMaterial),
        ])
      );

      const availableMats = allMaterials.filter(
        (mat: any) =>
          !materialsInRelations.has(mat.idMaterial) &&
          mat.idMaterial !== material.idMaterial
      );
      setAvailableMaterials(availableMats);

      const currentRelation = relations.find(
        (rel: any) => rel.materialPadre.idMaterial === material.idMaterial
      );
      const selected = currentRelation ? currentRelation.materialesHijos : [];
      setSelectedMaterials(selected);

      setProveedores(proveedoresRes.data);
      setDepartamentos(departamentosRes.data);
      setHoteles(hotelesRes.data);

      console.log("Current material:", material);
      console.log("Available materials:", availableMats);
      console.log("Selected materials:", selected);
      console.log("All relations:", relations);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleMaterialToggle = (toggledMaterial: any) => {
    if (
      selectedMaterials.some(
        (mat) => mat.idMaterial === toggledMaterial.idMaterial
      )
    ) {
      setSelectedMaterials(
        selectedMaterials.filter(
          (mat) => mat.idMaterial !== toggledMaterial.idMaterial
        )
      );
      setAvailableMaterials([...availableMaterials, toggledMaterial]);
    } else {
      setSelectedMaterials([...selectedMaterials, toggledMaterial]);
      setAvailableMaterials(
        availableMaterials.filter(
          (mat) => mat.idMaterial !== toggledMaterial.idMaterial
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedMaterialData = {
      name: updatedMaterial.name,
      model: updatedMaterial.model,
      serial_number: updatedMaterial.serial_number,
      stock: updatedMaterial.stock,
      expiration_date: updatedMaterial.expiration_date,
      purchase_date: updatedMaterial.purchase_date,
      description: updatedMaterial.description,
      elementsType: updatedMaterial.elementsType,
      status: updatedMaterial.status,
      materialtype: updatedMaterial.materialtype,
      hotelId: updatedMaterial.idHotel || null,
      proveedorId: updatedMaterial.idProveedor || null,
      departamentoId: updatedMaterial.idDepartamento || null,
    };

    console.log("Datos a enviar:", updatedMaterialData);

    try {
      const responseMaterial = await axios.patch(
        `http://localhost:3001/material/${updatedMaterial.idMaterial}`,
        updatedMaterialData
      );
      const newMaterial = responseMaterial.data;

      const relacionData = {
        fk_material_padre: newMaterial.idMaterial,
        fk_material_hijos: selectedMaterials.map((mat) => mat.idMaterial),
        amount: 1, // You might want to add a field to set this dynamically
      };

      const existingRelation = allRelations.find(
        (rel) => rel.fk_material_padre === newMaterial.idMaterial
      );

      if (existingRelation) {
        await axios.patch(
          `http://localhost:3001/relacion-elements/${existingRelation.id}`,
          relacionData
        );
      } else {
        await axios.post(
          `http://localhost:3001/relacion-elements`,
          relacionData
        );
      }

      onUpdate(newMaterial);
      onClose();
      console.log("Respuesta del servidor:", newMaterial);
      console.log("Datos de relación a enviar:", relacionData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al actualizar el material", error.response?.data);
      } else {
        console.error("Error desconocido", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Material</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              value={updatedMaterial?.name || ""}
              onChange={(e) =>
                setUpdatedMaterial({
                  ...updatedMaterial,
                  name: e.target.value,
                })
              }
            />
          </label>
          <label>
            Modelo:
            <input
              type="text"
              value={updatedMaterial.model || ""}
              onChange={(e) =>
                setUpdatedMaterial({
                  ...updatedMaterial,
                  model: e.target.value,
                })
              }
            />
          </label>
          <label>
            Número de Serie:
            <input
              type="text"
              value={updatedMaterial.serial_number || ""}
              onChange={(e) =>
                setUpdatedMaterial({
                  ...updatedMaterial,
                  serial_number: e.target.value,
                })
              }
            />
          </label>
          <label>
            Stock:
            <input
              type="number"
              value={updatedMaterial.stock || ""}
              onChange={(e) =>
                setUpdatedMaterial({
                  ...updatedMaterial,
                  stock: Number(e.target.value),
                })
              }
            />
          </label>
          <label>
            Fecha de Expiración:
            <input
              type="date"
              value={updatedMaterial.expiration_date || ""}
              onChange={(e) =>
                setUpdatedMaterial({
                  ...updatedMaterial,
                  expiration_date: e.target.value,
                })
              }
            />
          </label>
          <label>
            Fecha de Compra:
            <input
              type="date"
              value={updatedMaterial.purchase_date || ""}
              onChange={(e) =>
                setUpdatedMaterial({
                  ...updatedMaterial,
                  purchase_date: e.target.value,
                })
              }
            />
          </label>
          <label>
            Descripción:
            <input
              type="text"
              value={updatedMaterial.description || ""}
              onChange={(e) =>
                setUpdatedMaterial({
                  ...updatedMaterial,
                  description: e.target.value,
                })
              }
            />
          </label>

          <label>
            Proveedor:
            <select
              value={updatedMaterial.idProveedor || ""}
              onChange={(e) =>
                setUpdatedMaterial({
                  ...updatedMaterial,
                  idProveedor: e.target.value,
                })
              }
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((prov) => (
                <option key={prov.idProveedor} value={prov.idProveedor}>
                  {prov.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Departamento:
            <select
              value={updatedMaterial.idDepartamento || ""}
              onChange={(e) =>
                setUpdatedMaterial({
                  ...updatedMaterial,
                  idDepartamento: e.target.value,
                })
              }
            >
              <option value="">Seleccione un departamento</option>
              {departamentos.map((dept) => (
                <option key={dept.idDepartamento} value={dept.idDepartamento}>
                  {dept.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Hotel:
            <select
              value={updatedMaterial.idHotel || ""}
              onChange={(e) =>
                setUpdatedMaterial({
                  ...updatedMaterial,
                  idHotel: e.target.value,
                })
              }
            >
              <option value="">Seleccione un hotel</option>
              {hoteles.map((hotel) => (
                <option key={hotel.idHotel} value={hotel.idHotel}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </label>

          <h3>Materiales Relacionados</h3>
          {selectedMaterials.map((mat) => (
            <div key={mat.idMaterial}>
              <label>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => handleMaterialToggle(mat)}
                />
                {mat.name} (Stock: {mat.stock})
              </label>
            </div>
          ))}

          <h3>Materiales Disponibles</h3>
          {availableMaterials.map((mat) => (
            <div key={mat.idMaterial}>
              <label>
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => handleMaterialToggle(mat)}
                />
                {mat.name} (Stock: {mat.stock})
              </label>
            </div>
          ))}

          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMaterialModal;
