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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get("http://localhost:3001/proveedores");
        setProveedores(response.data);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
      }
    };

    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/departamentos");
        setDepartamentos(response.data);
      } catch (error) {
        console.error("Error al obtener departamentos:", error);
      }
    };

    const fetchHoteles = async () => {
      try {
        const response = await axios.get("http://localhost:3001/hoteles");
        setHoteles(response.data);
      } catch (error) {
        console.error("Error al obtener hoteles:", error);
      }
    };

    fetchProveedores();
    fetchDepartamentos();
    fetchHoteles();
  }, []);

  const resetForm = () => {
    setMaterial({
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

    setSubMaterialsList([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddSubMaterial = async () => {
    const subMaterialData = {
      ...subMaterial,
      materialtype: 1,
    };

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

      alert("SubMaterial agregado exitosamente.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al crear el submaterial", error.response?.data);
        alert(
          `Error al crear el submaterial: ${
            error.response?.data.message || "Desconocido"
          }`
        );
      } else {
        console.error("Error desconocido", error);
        alert("Error desconocido al crear el submaterial.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const materialData = {
      ...material,
      materialtype: 0,
    };

    try {
      const responseMaterial = await axios.post(
        "http://localhost:3001/material",
        materialData
      );
      const newMaterial = responseMaterial.data;

      if (subMaterialsList.length > 0) {
        const subMaterialIds = subMaterialsList.map((sub) => sub.idMaterial);

        const relacionData = {
          fk_material_padre: newMaterial.idMaterial,
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
      alert("Material creado exitosamente.");
      handleClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al crear el material", error.response?.data);
        alert(
          `Error al crear el material: ${
            error.response?.data.message || "Desconocido"
          }`
        );
      } else {
        console.error("Error desconocido", error);
        alert("Error desconocido al crear el material.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
                    required
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
                    required
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
                    required
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
                    required
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
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Proveedor *</label>
                  <select
                    value={material.proveedorId}
                    onChange={(e) =>
                      setMaterial({ ...material, proveedorId: e.target.value })
                    }
                    required
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
                    required
                    min={0}
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
                    required
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
                    required
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
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hotel *</label>
                  <select
                    value={material.hotelId}
                    onChange={(e) =>
                      setMaterial({ ...material, hotelId: e.target.value })
                    }
                    required
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
                    min={0}
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
                  <label>Vencimiento de garantía / Fecha de expiración *</label>
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
                  disabled={isLoading}
                >
                  Agregar SubMaterial
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-finish" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Finalizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaterialModal;
