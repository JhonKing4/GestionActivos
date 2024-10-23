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
  const token = localStorage.getItem("access_token");

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
        axios.get("http://localhost:3001/material", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get("http://localhost:3001/relacion-elements", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get("http://localhost:3001/proveedores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get("http://localhost:3001/departamentos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get("http://localhost:3001/hoteles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
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

  const isValidUUID = (id: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
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
        updatedMaterialData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newMaterial = responseMaterial.data;

      const relacionData = {
        fk_material_padre: newMaterial.idMaterial,
        fk_material_hijos: selectedMaterials.map((mat) => mat.idMaterial),
        amount: 1,
      };

      const existingRelation = allRelations.find(
        (rel) => rel.materialPadre.idMaterial === newMaterial.idMaterial
      );

      if (existingRelation) {
        if (
          existingRelation &&
          isValidUUID(existingRelation.idRelacionElement)
        ) {
          await axios.patch(
            `http://localhost:3001/relacion-elements/${existingRelation.idRelacionElement}`,
            relacionData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          await axios.post(
            `http://localhost:3001/relacion-elements`,
            relacionData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(
            "Nueva relación creada debido a un ID inválido o relación no existente."
          );
        }
      } else {
        await axios.post(
          `http://localhost:3001/relacion-elements`,
          relacionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Nueva relación creada.");
      }

      onUpdate(newMaterial);
      onClose();
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
        <h2 className="modal-title">Editar Material</h2>
        <div className="modal-layout">
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nombre:</label>
                <input
                  id="name"
                  type="text"
                  value={updatedMaterial?.name || ""}
                  onChange={(e) =>
                    setUpdatedMaterial({
                      ...updatedMaterial,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="model">Modelo:</label>
                <input
                  id="model"
                  type="text"
                  value={updatedMaterial.model || ""}
                  onChange={(e) =>
                    setUpdatedMaterial({
                      ...updatedMaterial,
                      model: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="serial_number">Número de Serie:</label>
                <input
                  id="serial_number"
                  type="text"
                  value={updatedMaterial.serial_number || ""}
                  onChange={(e) =>
                    setUpdatedMaterial({
                      ...updatedMaterial,
                      serial_number: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock:</label>
                <input
                  id="stock"
                  type="number"
                  value={updatedMaterial.stock || ""}
                  onChange={(e) =>
                    setUpdatedMaterial({
                      ...updatedMaterial,
                      stock: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="expiration_date">Fecha de Expiración:</label>
                <input
                  id="expiration_date"
                  type="date"
                  value={updatedMaterial.expiration_date || ""}
                  onChange={(e) =>
                    setUpdatedMaterial({
                      ...updatedMaterial,
                      expiration_date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="purchase_date">Fecha de Compra:</label>
                <input
                  id="purchase_date"
                  type="date"
                  value={updatedMaterial.purchase_date || ""}
                  onChange={(e) =>
                    setUpdatedMaterial({
                      ...updatedMaterial,
                      purchase_date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Descripción:</label>
                <input
                  id="description"
                  value={updatedMaterial.description || ""}
                  onChange={(e) =>
                    setUpdatedMaterial({
                      ...updatedMaterial,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="idProveedor">Proveedor:</label>
                <select
                  id="idProveedor"
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
              </div>
              <div className="form-group">
                <label htmlFor="idDepartamento">Departamento:</label>
                <select
                  id="idDepartamento"
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
                    <option
                      key={dept.idDepartamento}
                      value={dept.idDepartamento}
                    >
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="idHotel">Hotel:</label>
                <select
                  id="idHotel"
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
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </form>
          <div className="materials-section">
            <div className="materials-container">
              <div className="related-materials">
                <h3>Materiales Relacionados</h3>
                <div className="materials-list">
                  {selectedMaterials.map((mat) => (
                    <div key={mat.idMaterial} className="material-item">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => handleMaterialToggle(mat)}
                        />
                        <span className="checkmark"></span>
                        {mat.name} (Stock: {mat.stock})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="available-materials">
                <h3>Materiales Disponibles</h3>
                <div className="materials-list">
                  {availableMaterials.map((mat) => (
                    <div key={mat.idMaterial} className="material-item">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={() => handleMaterialToggle(mat)}
                        />
                        <span className="checkmark"></span>
                        {mat.name} (Stock: {mat.stock})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMaterialModal;
