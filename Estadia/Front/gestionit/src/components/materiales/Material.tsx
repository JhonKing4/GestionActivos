import React, { useState, useEffect } from "react";
import { Download, Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import AddMaterialModal from "./AddMaterialModal";
import DeleteModal from "../Extras/DeleteModal";
import EditMaterialModal from "./EditMaterial";
import "../../styles/Tabla.css";

interface Hotel {
  idHotel: string;
  name: string;
}

interface Proveedor {
  idProveedor: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  rfc: string;
}

interface Departamento {
  idDepartamento: string;
  name: string;
  description: string;
}

interface MaterialItem {
  idMaterial: string;
  name: string;
  model: string;
  serial_number: string;
  stock: number;
  expiration_date: string;
  purchase_date: string;
  description: string;
  elementsType: number;
  status: number;
  materialtype: number;
  hotel: Hotel;
  proveedor: Proveedor;
  departamento: Departamento;
  hierarchyNumber?: string;
  depth?: number;
}

interface MaterialRelation {
  materialPadre: MaterialItem;
  materialesHijos: MaterialItem[];
  amount: number;
}

const Material: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [relations, setRelations] = useState<MaterialRelation[]>([]);
  const [processedMaterials, setProcessedMaterials] = useState<MaterialItem[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(
    null
  );
  const [selectedSubMaterials, setSelectedSubMaterials] = useState<
    MaterialItem[]
  >([]);

  const handleEditMaterial = (material: MaterialItem) => {
    const relatedRelation = relations.find(
      (rel) => rel.materialPadre.idMaterial === material.idMaterial
    );
    setSelectedMaterial(material);
    setSelectedSubMaterials(
      relatedRelation ? relatedRelation.materialesHijos : []
    );
    setIsEditModalOpen(true);
  };
  const fetchData = async () => {
    try {
      const [materialsResponse, relationsResponse] = await Promise.all([
        fetch("http://localhost:3002/material"),
        fetch("http://localhost:3002/relacion-elements"),
      ]);

      const materialsData = await materialsResponse.json();
      const relationsData = await relationsResponse.json();

      const processedMaterials = Array.isArray(materialsData)
        ? materialsData
        : [materialsData].filter(Boolean);
      setMaterials(processedMaterials);

      const processedRelations = Array.isArray(relationsData)
        ? relationsData
        : [relationsData].filter(Boolean);
      setRelations(processedRelations);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMaterials([]);
      setRelations([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const processMaterialsWithHierarchy = () => {
    if (!materials.length) return;

    const processed: MaterialItem[] = [];
    const processedChildrenSet = new Set<string>();
    const childrenMap = new Map<string, MaterialRelation>();

    relations.forEach((relation) => {
      childrenMap.set(relation.materialPadre.idMaterial, relation);
      relation.materialesHijos.forEach((child) => {
        processedChildrenSet.add(child.idMaterial);
      });
    });

    let parentCounter = 1;

    const processChildren = (
      parentId: string,
      parentHierarchy: string,
      depth: number = 0
    ) => {
      const relationAsParent = childrenMap.get(parentId);

      if (relationAsParent && relationAsParent.materialesHijos.length > 0) {
        relationAsParent.materialesHijos.forEach((childMaterial, index) => {
          const material = materials.find(
            (m) => m.idMaterial === childMaterial.idMaterial
          );

          if (material) {
            const childHierarchy = `${parentHierarchy}.${index + 1}`;

            processed.push({
              ...material,
              hierarchyNumber: childHierarchy,
              depth: depth + 1,
            });

            processChildren(material.idMaterial, childHierarchy, depth + 1);
          }
        });
      }
    };

    materials.forEach((material) => {
      if (processedChildrenSet.has(material.idMaterial)) return;

      const hierarchyNumber = `${parentCounter}`;

      processed.push({
        ...material,
        hierarchyNumber: hierarchyNumber,
        depth: 0,
      });

      parentCounter++;

      processChildren(material.idMaterial, hierarchyNumber);
    });

    setProcessedMaterials(processed);
  };

  useEffect(() => {
    processMaterialsWithHierarchy();
  }, [materials, relations]);

  const handleAddMaterial = async (materialData: any) => {
    setIsModalOpen(false);
    await fetchData();
  };
  const handleDeleteMaterial = async (materialId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3002/relacion-elements/${materialId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el material.");
      }

      await fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error eliminando material:", error);
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header userName="Jhoandi" />
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Materiales</h2>
              <button
                className="add-button"
                onClick={() => setIsModalOpen(true)}
              >
                Agregar
              </button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Modelo</th>
                    <th>Numero de serie</th>
                    <th>Stock</th>
                    <th>Fecha de expiración</th>
                    <th>Fecha de compra</th>
                    <th>Descripción</th>
                    <th>Tipo de elemento</th>
                    <th>Estado</th>
                    <th>Hotel</th>
                    <th>Proveedor</th>
                    <th>Departamento</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {processedMaterials.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        item.depth && item.depth > 0
                          ? "child-row"
                          : "parent-row"
                      }
                    >
                      <td>{item.hierarchyNumber}</td>
                      <td
                        className={
                          item.depth && item.depth > 0 ? "indented-cell" : ""
                        }
                        style={{ paddingLeft: `${(item.depth || 0) * 20}px` }}
                      >
                        {item.name}
                      </td>
                      <td>{item.model}</td>
                      <td>{item.serial_number}</td>
                      <td>{item.stock}</td>
                      <td>{item.expiration_date}</td>
                      <td>{item.purchase_date}</td>
                      <td>{item.description}</td>
                      <td>{item.elementsType}</td>
                      <td>{item.status}</td>
                      <td>{item.hotel.name}</td>
                      <td>{item.proveedor.name}</td>
                      <td>{item.departamento.name}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn">
                            <Download size={18} />
                          </button>
                          <button
                            className="action-btn yellow"
                            onClick={() => handleEditMaterial(item)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="action-btn red"
                            onClick={() => {
                              setSelectedMaterial(item);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <div className="showing-entries">
                <span>Showing</span>
                <select defaultValue="10">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </select>
              </div>
              <div className="pagination">
                <button className="page-btn">←</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddMaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMaterial}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() =>
          handleDeleteMaterial(selectedMaterial?.idMaterial || "")
        }
      />

      <EditMaterialModal
        isOpen={isEditModalOpen}
        onClose={async () => {
          setIsEditModalOpen(false);
          await fetchData();
        }}
        material={selectedMaterial || {}}
        onUpdate={async (updatedMaterial) => {
          setMaterials((prev) =>
            prev.map((m) =>
              m.idMaterial === updatedMaterial.idMaterial ? updatedMaterial : m
            )
          );
          setIsEditModalOpen(false);
          await fetchData();
        }}
      />
    </div>
  );
};

export default Material;
