import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";

interface AssignmentItem {
  name: string;
  phone: string;
  address: string;
  email: string;
  rfc: string;
}

const Proveedor = () => {
  const assignmentData: AssignmentItem[] = [
    {
      name: "Lenovo",
      phone: "9981454665",
      address:
        "Carretera Libre 85 Punta Sam, Isla Blanca 85 SM6, Manzana 2 Playa Mujeres, 77400 Costa Mujeres, Q.R.",
      email: "lenovo@gmail.com",
      rfc: "123456789102",
    },
  ];
  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header userName="Jhoandi" />
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Proveedores</h2>
              <button className="add-button">Agregar</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Email</th>
                    <th>RFC</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>
                      <td>{item.email}</td>
                      <td>{item.rfc}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn yellow">
                            <Pencil size={18} />
                          </button>
                          <button className="action-btn">
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

export default Proveedor();
