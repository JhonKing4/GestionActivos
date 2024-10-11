import React, { useState, useEffect } from "react";
import "../../styles/AddMaterialModal.css";
import axios from "axios";

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (materialData: any) => void;
}

const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [subMaterial, setSubMaterial] = useState<any>({
    name: "",
    model: "",
    serial_number: "",
    stock: 0,
    expiration_date: "",
    purchase_date: "",
    description: "",
    elementsType: 0,
    status: 0,
    hotelId: "",
    proveedorId: "",
    departamentoId: "",
  });

  const [material, setMaterial] = useState<any>({
    name: "",
    model: "",
    serial_number: "",
    stock: 0,
    expiration_date: "",
    purchase_date: "",
    description: "",
    elementsType: 0,
    status: 0,
    hotelId: "",
    proveedorId: "",
    departamentoId: "",
  });

  const [subMaterialsList, setSubMaterialsList] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [hoteles, setHoteles] = useState<any[]>([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      const response = await axios.get("http://localhost:3001/proveedores");
      setProveedores(response.data);
    };

    const fetchDepartamentos = async () => {
      const response = await axios.get("http://localhost:3001/departamentos");
      setDepartamentos(response.data);
    };

    const fetchHoteles = async () => {
      const response = await axios.get("http://localhost:3001/hoteles");
      console.log("Datos de hoteles:", response.data);
      setHoteles(response.data);
    };

    fetchProveedores();
    fetchDepartamentos();
    fetchHoteles();
  }, []);

  const handleAddSubMaterial = async () => {
    const subMaterialData = {
      name: subMaterial.name,
      model: subMaterial.model,
      serial_number: subMaterial.serial_number,
      stock: subMaterial.stock,
      expiration_date: subMaterial.expiration_date,
      purchase_date: subMaterial.purchase_date,
      description: subMaterial.description,
      elementsType: subMaterial.elementsType,
      status: subMaterial.status,
      materialtype: 1,
      hotelId: subMaterial.hotelId,
      proveedorId: subMaterial.proveedorId,
      departamentoId: subMaterial.departamentoId,
    };

    console.log("SubMaterialData que se enviará:", subMaterialData);

    try {
      const response = await axios.post(
        "http://localhost:3001/material",
        subMaterialData
      );
      const newSubMaterial = response.data;
      setSubMaterialsList([...subMaterialsList, newSubMaterial]);

      setSubMaterial({
        name: "",
        model: "",
        serial_number: "",
        stock: 0,
        expiration_date: "",
        purchase_date: "",
        description: "",
        elementsType: 0,
        status: 0,
        hotelId: "",
        proveedorId: "",
        departamentoId: "",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al crear el submaterial", error.response?.data);
      } else {
        console.error("Error desconocido", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const materialData = {
      ...material,
      hotelId: material.hotelId,
      proveedorId: material.proveedorId,
      departamentoId: material.departamentoId,
      materialtype: 0,
    };

    console.log("MaterialData que se enviará:", materialData);

    try {
      const responseMaterial = await axios.post(
        "http://localhost:3001/material",
        materialData
      );
      const newMaterial = responseMaterial.data;

      console.log("Nuevo material creado:", newMaterial);

      if (subMaterialsList.length > 0) {
        const subMaterialIds = subMaterialsList.map((sub) => sub.id);
        console.log("IDs de materiales hijos:", subMaterialIds);

        const relacionData = {
          fk_material_padre: newMaterial.id,
          fk_material_hijos: subMaterialIds,
          amount: subMaterialsList.length,
        };

        await axios.post(
          "http://localhost:3001/relacion-elements",
          relacionData
        );
      } else {
        console.log("No hay materiales hijos para relacionar.");
      }

      onAdd(newMaterial);
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al crear el material", error.response?.data);
      } else {
        console.error("Error desconocido", error);
      }
    }
  };

  console.log("Hotel ID seleccionado:", subMaterial.hotelId);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <form onSubmit={handleSubmit}>
          <div className="forms-container">
            <div className="material-form">
              <h2>Agregar material</h2>
              <div className="form-content">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={material.name}
                    onChange={(e) =>
                      setMaterial({ ...material, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Tipo *</label>
                  <select
                    value={material.elementsType}
                    onChange={(e) =>
                      setMaterial({
                        ...material,
                        elementsType: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="">Seleccionar</option>
                    <option value={0}>Software</option>
                    <option value={1}>Hardware</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Modelo ó Versión *</label>
                  <input
                    type="text"
                    value={material.model}
                    onChange={(e) =>
                      setMaterial({ ...material, model: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Estado *</label>
                  <select
                    value={material.status}
                    onChange={(e) =>
                      setMaterial({
                        ...material,
                        status: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="">Seleccionar</option>
                    <option value={0}>Inactivo</option>
                    <option value={1}>Activo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Número de serie *</label>
                  <input
                    type="text"
                    value={material.serial_number}
                    onChange={(e) =>
                      setMaterial({
                        ...material,
                        serial_number: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Proveedor *</label>
                  <select
                    value={material.proveedorId}
                    onChange={(e) =>
                      setMaterial({ ...material, proveedorId: e.target.value })
                    }
                  >
                    <option value="">Seleccionar</option>
                    {proveedores.map((prov) => (
                      <option key={prov.idProveedor} value={prov.idProveedor}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Existencias *</label>
                  <input
                    type="number"
                    value={material.stock}
                    onChange={(e) =>
                      setMaterial({
                        ...material,
                        stock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Departamento *</label>
                  <select
                    value={material.departamentoId}
                    onChange={(e) =>
                      setMaterial({
                        ...material,
                        departamentoId: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccionar</option>
                    {departamentos.map((dep) => (
                      <option
                        key={dep.idDepartamento}
                        value={dep.idDepartamento}
                      >
                        {dep.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Vencimiento de garantía / Fecha de expiración *</label>
                  <input
                    type="date"
                    value={material.expiration_date}
                    onChange={(e) =>
                      setMaterial({
                        ...material,
                        expiration_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Fecha de compra *</label>
                  <input
                    type="date"
                    value={material.purchase_date}
                    onChange={(e) =>
                      setMaterial({
                        ...material,
                        purchase_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Hotel *</label>
                  <select
                    value={material.hotelId}
                    onChange={(e) =>
                      setMaterial({ ...material, hotelId: e.target.value })
                    }
                  >
                    <option value="">Seleccionar</option>
                    {hoteles.map((hotel) => (
                      <option key={hotel.idHotel} value={hotel.idHotel}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <input
                    type="text"
                    value={material.description}
                    onChange={(e) =>
                      setMaterial({ ...material, description: e.target.value })
                    }
                  />
                </div>

                <div className="form-group submaterials-group">
                  <label>SubMateriales Agregados</label>
                  <div className="checkbox-list">
                    <div className="submaterials-list">
                      {subMaterialsList.map((sub, index) => (
                        <div key={index} className="submaterial-item">
                          {sub.name} - {sub.model}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="submaterial-form">
              <h2>Agregar SubMaterial</h2>
              <div className="form-content">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    placeholder="Ingrese el nombre"
                    value={subMaterial.name}
                    onChange={(e) =>
                      setSubMaterial({ ...subMaterial, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Tipo *</label>
                  <select
                    value={subMaterial.elementsType}
                    onChange={(e) =>
                      setSubMaterial({
                        ...subMaterial,
                        elementsType: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="">Seleccionar</option>
                    <option value={0}>Software</option>
                    <option value={1}>Hardware</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Modelo ó Versión *</label>
                  <input
                    type="text"
                    placeholder="Ingrese el modelo o versión"
                    value={subMaterial.model}
                    onChange={(e) =>
                      setSubMaterial({ ...subMaterial, model: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Estado *</label>
                  <select
                    value={subMaterial.status}
                    onChange={(e) =>
                      setSubMaterial({
                        ...subMaterial,
                        status: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="">Seleccionar</option>
                    <option value={0}>Inactivo</option>
                    <option value={1}>Activo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Número de serie *</label>
                  <input
                    type="text"
                    placeholder="Ingrese el número de serie"
                    value={subMaterial.serial_number}
                    onChange={(e) =>
                      setSubMaterial({
                        ...subMaterial,
                        serial_number: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Proveedor *</label>
                  <select
                    value={subMaterial.proveedorId}
                    onChange={(e) => {
                      console.log(
                        "Proveedor seleccionado (subMaterial):",
                        e.target.value
                      );
                      setSubMaterial({
                        ...subMaterial,
                        proveedorId: e.target.value,
                      });
                    }}
                  >
                    <option value="">Seleccionar</option>
                    {proveedores.map((prov) => (
                      <option key={prov.idProveedor} value={prov.idProveedor}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Existencias *</label>
                  <input
                    type="number"
                    placeholder="Ingrese la cantidad"
                    value={subMaterial.stock}
                    onChange={(e) =>
                      setSubMaterial({
                        ...subMaterial,
                        stock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Departamento *</label>
                  <select
                    value={subMaterial.departamentoId}
                    onChange={(e) => {
                      console.log(
                        "Departamento seleccionado (subMaterial):",
                        e.target.value
                      );
                      setSubMaterial({
                        ...subMaterial,
                        departamentoId: e.target.value,
                      });
                    }}
                  >
                    <option value="">Seleccionar</option>
                    {departamentos.map((departamento) => (
                      <option
                        key={departamento.idDepartamento}
                        value={departamento.idDepartamento}
                      >
                        {departamento.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Vencimiento de garantía / Fecha de expiración</label>
                  <input
                    type="date"
                    value={subMaterial.expiration_date}
                    onChange={(e) =>
                      setSubMaterial({
                        ...subMaterial,
                        expiration_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Fecha de compra *</label>
                  <input
                    type="date"
                    value={subMaterial.purchase_date}
                    onChange={(e) =>
                      setSubMaterial({
                        ...subMaterial,
                        purchase_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Hotel *</label>
                  <select
                    value={subMaterial.hotelId}
                    onChange={(e) => {
                      console.log(
                        "Hotel ID seleccionado (subMaterial):",
                        e.target.value
                      );
                      setSubMaterial({
                        ...subMaterial,
                        hotelId: e.target.value,
                      });
                    }}
                  >
                    <option value="">Seleccionar</option>
                    {hoteles.map((hotel) => (
                      <option key={hotel.idHotel} value={hotel.idHotel}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <input
                    type="text"
                    placeholder="Escribir"
                    value={subMaterial.description}
                    onChange={(e) =>
                      setSubMaterial({
                        ...subMaterial,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  type="button"
                  className="btn-add-submaterial"
                  onClick={handleAddSubMaterial}
                >
                  Agregar SubMaterial
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-finish">
              Finalizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaterialModal;
