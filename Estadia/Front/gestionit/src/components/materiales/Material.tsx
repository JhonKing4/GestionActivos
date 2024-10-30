import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import AddMaterialModal from "./AddMaterialModal";
import DeleteModal from "../Extras/DeleteModal";
import EditMaterialModal from "./EditMaterial";
import "../../styles/Tabla.css";
import Loader from "../Extras/loading";
import axios from "axios";
import Pagination from "../Extras/PaginationMaterial";
import { PDFDownloadButton } from "../Extras/PlantillaInventario";
import NotFound from "../Extras/Not Found";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
  const [currentMateriales, setCurrentMateriales] = useState<MaterialItem[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("access_token");

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

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = processedMaterials.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    setCurrentMateriales(currentItems);
  }, [currentPage, processedMaterials, itemsPerPage]);
  const fetchData = async () => {
    try {
      const [materialsResponse, relationsResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/material`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${process.env.REACT_APP_API_URL}/relacion-elements`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const materialsData = await materialsResponse.json();
      const relationsData = await relationsResponse.json();

      const processedMaterials = Array.isArray(materialsData)
        ? materialsData
        : [];
      setMaterials(processedMaterials);

      const processedRelations = Array.isArray(relationsData)
        ? relationsData
        : [];
      setRelations(processedRelations);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMaterials([]);
      setRelations([]);
      setLoading(false);
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
        `${process.env.REACT_APP_API_URL}/relacion-elements/${materialId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchData();
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      fetchData();
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/material/search/${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        if (response.data.length > 0) {
          setMaterials(response.data);
        } else {
          setMaterials([]);
        }
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setMaterials([]);
      } else {
        setError("Error fetching search results");
      }
    }
  };

  const totalPages = Math.ceil(processedMaterials.length / itemsPerPage);

  if (loading) return <Loader />;
  if (error) return <NotFound />;

  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header />
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Materiales</h2>
              <div className="search-group">
                <svg
                  className="search-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <g>
                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                  </g>
                </svg>
                <input
                  placeholder="Search"
                  type="search"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="searchs-button" onClick={handleSearch}>
                  Buscar
                </button>
              </div>
              <PDFDownloadButton />
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
                  {currentMateriales.length > 0 ? (
                    currentMateriales.map((item, index) => (
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
                        <td>
                          {(() => {
                            switch (item.elementsType) {
                              case 0:
                                return "Software";
                              case 1:
                                return "Hardware";
                              default:
                                return "Desconocido";
                            }
                          })()}
                        </td>
                        <td>
                          {(() => {
                            switch (item.status) {
                              case 0:
                                return "Inactivo";
                              case 1:
                                return "Activo";
                              default:
                                return "Desconocido";
                            }
                          })()}
                        </td>
                        <td>{item.hotel.name}</td>
                        <td>{item.proveedor.name}</td>
                        <td>{item.departamento.name}</td>
                        <td>
                          <div className="action-buttons">
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>
                        No se encontraron resultados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <div className="showing-entries"></div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                itemsPerPage={itemsPerPage}
                totalItems={processedMaterials.length}
              />
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
          window.location.reload();
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
          window.location.reload();
        }}
      />
    </div>
  );
};

export default Material;
