import React from "react";
import "../../styles/AddMaterialModal.css";

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
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({});
  };

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
                  <input type="text" placeholder="Ingrese el nombre" />
                </div>

                <div className="form-group">
                  <label>Tipo *</label>
                  <select>
                    <option value="">Seleccionar</option>
                    <option value="software">Software</option>
                    <option value="hardware">Hardware</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Modelo ó Versión *</label>
                  <input type="text" placeholder="Ingrese" />
                </div>

                <div className="form-group">
                  <label>Estado *</label>
                  <select>
                    <option value="">Seleccionar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Número de serie *</label>
                  <input type="text" placeholder="Ingrese el número de serie" />
                </div>

                <div className="form-group">
                  <label>Proveedor *</label>
                  <select>
                    <option value="">Seleccionar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Existencias *</label>
                  <div className="quantity-input">
                    <input type="number" placeholder="Ingrese la cantidad" />
                    <span className="quantity-icon"></span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Departamento *</label>
                  <select>
                    <option value="">Seleccionar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Vencimiento de garantía / Fecha de expiración *</label>
                  <input type="date" />
                </div>

                <div className="form-group">
                  <label>Fecha de compra *</label>
                  <input type="date" />
                </div>

                <div className="form-group">
                  <label>Hotel *</label>
                  <select>
                    <option value="">Seleccionar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <input type="text" placeholder="Escribir" />
                </div>

                <div className="form-group submaterials-group">
                  <label>SubMateriales Agregados</label>
                  <div className="checkbox-list">
                    <label className="checkbox-item">
                      <input type="checkbox" /> Mouse Hyper200
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" /> Teclado Hyper
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" /> Memoria USB
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" /> Teclado Hyper
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="submaterial-form">
              <h2>Agregar SubMaterial</h2>
              <div className="form-content">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input type="text" placeholder="Ingrese el nombre" />
                </div>

                <div className="form-group">
                  <label>Tipo *</label>
                  <select>
                    <option value="">Seleccionar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Modelo ó Versión *</label>
                  <input type="text" placeholder="Ingrese" />
                </div>

                <div className="form-group">
                  <label>Estado *</label>
                  <select>
                    <option value="">Seleccionar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Número de serie *</label>
                  <input type="text" placeholder="Ingrese el número de serie" />
                </div>

                <div className="form-group">
                  <label>Proveedor *</label>
                  <select>
                    <option value="">Seleccionar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Existencias *</label>
                  <div className="quantity-input">
                    <input type="number" placeholder="Ingrese la cantidad" />
                    <span className="quantity-icon"></span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Departamento *</label>
                  <select>
                    <option value="">Seleccionar</option>
                  </select>
                </div>

                <div className="form-group ">
                  <label>Vencimiento de garantía / Fecha de expiración</label>
                  <input type="date" />
                </div>

                <div className="form-group">
                  <label>Fecha de compra *</label>
                  <input type="date" />
                </div>

                <div className="form-group">
                  <label>Hotel *</label>
                  <select>
                    <option value="">Seleccionar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <input type="text" placeholder="Escribir" />
                </div>

                <button type="button" className="btn-add-submaterial">
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
