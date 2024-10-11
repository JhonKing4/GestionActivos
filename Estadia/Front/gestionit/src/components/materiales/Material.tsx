import { Download, Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";

import { useState, useEffect } from "react";
import AddMaterialModal from "./AddMaterialModal";
import DeleteModal from "../Extras/DeleteModal";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsResponse, relationsResponse] = await Promise.all([
          fetch("http://localhost:3001/material"),
          fetch("http://localhost:3001/relacion-elements"),
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

    fetchData();
  }, []);

  const processMaterialsWithHierarchy = () => {
    if (!materials.length || !relations.length) return;

    const processed: MaterialItem[] = [];
    let parentCounter = 1;

    const childrenMap = new Map<string, string>();
    relations.forEach((relation) => {
      if (relation.materialesHijos) {
        relation.materialesHijos.forEach((childMaterial) => {
          childrenMap.set(
            childMaterial.idMaterial,
            relation.materialPadre.idMaterial
          );
        });
      }
    });


    const processChildren = (parentId: string, parentHierarchy: string) => {
      const relationAsParent = relations.find(
        (rel) => rel.materialPadre.idMaterial === parentId
      );

      if (relationAsParent && relationAsParent.materialesHijos) {
        let childCounter = 1;
        relationAsParent.materialesHijos.forEach((childMaterial) => {
          const material = materials.find(
            (m) => m.idMaterial === childMaterial.idMaterial
          );
          if (material) {
            const childHierarchy = `${parentHierarchy}.${childCounter}`;
            processed.push({
              ...material,
              hierarchyNumber: childHierarchy,
            });
            childCounter++;

            processChildren(material.idMaterial, childHierarchy);
          }
        });
      }
    };

    materials.forEach((material) => {
      const parentId = childrenMap.get(material.idMaterial);

      if (!parentId) {
        processed.push({
          ...material,
          hierarchyNumber: `${parentCounter}`,
        });

        processChildren(material.idMaterial, `${parentCounter}`);
        parentCounter++;
      }
    });

    setProcessedMaterials(processed);
  };

  useEffect(() => {
    processMaterialsWithHierarchy();
  }, [materials, relations]);

  const handleAddMaterial = (materialData: any) => {
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="app-container">
      <Side />
      <div className="main-container">
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
                        item.hierarchyNumber?.includes(".")
                          ? "child-row"
                          : "parent-row"
                      }
                    >
                      <td>{item.hierarchyNumber}</td>
                      <td
                        className={
                          item.hierarchyNumber?.includes(".")
                            ? "indented-cell"
                            : ""
                        }
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
                          <button className="action-btn yellow">
                            <Pencil size={18} />
                          </button>
                          <button
                            className="action-btn red"
                            onClick={() => setIsDeleteModalOpen(true)}
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
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Material;
