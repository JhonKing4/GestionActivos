import { Download, Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Tabla.css"

interface AssignmentItem {
  name: string;
  model: string;
  serial_number: string;
  stock: number;
  expiration_date: string;
  purchase_date: string;
  description: string;
  elementsType: string;
  status: string;
  materialtype: string;
  hotelId: string;
  proveedorId: string;
  departamentoId: string;
}

const Material = () => {
  const assignmentData: AssignmentItem[] = [
    {
      name: "Laptop Lenovo",
      model: "IdeaPad L340",
      serial_number: "0242156035",
      stock: 1,
      expiration_date: "2028-05-03",
      purchase_date: "2018-06-05",
      description: "Es de color negro",
      elementsType: "Hardware",
      status: "Activo",
      materialtype: "Mouse",
      hotelId: "Majestic",
      proveedorId: "Lenovo",
      departamentoId: "Sistemas",
    },
  ];
  return (
    <div className="app-container">
      <Side />
      <div className="main-container">
        <Header userName="Jhoandi" />
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Materiales</h2>
              <button className="add-button">Agregar</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
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
                    <th>Materiales Hijos</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.model}</td>
                      <td>{item.serial_number}</td>
                      <td>{item.stock}</td>
                      <td>{item.expiration_date}</td>
                      <td>{item.purchase_date}</td>
                      <td>{item.description}</td>
                      <td>{item.elementsType}</td>
                      <td>{item.status}</td>
                      <td>{item.hotelId}</td>
                      <td>{item.proveedorId}</td>
                      <td>{item.departamentoId}</td>
                      <td>{item.materialtype}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn">
                            <Download size={18} />
                          </button>
                          <button className="action-btn yellow">
                            <Pencil size={18} />
                          </button>
                          <button className="action-btn red">
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
    </div>
  );
};

export default Material();
