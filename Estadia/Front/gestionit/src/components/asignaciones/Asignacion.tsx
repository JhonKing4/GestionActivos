
import "../../styles/Sidebar.css";
import "../../styles/Tabla.css";
import { Download, Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";

interface AssignmentItem {
  material: string;
  colaborador: string;
  departamento: string;
  fechaAsignacion: string;
  fechaEntrega: string;
  observacion: string;
  estado: string;
  nombreHotel: string;
}

const Asignacion = () => {
  const assignmentData: AssignmentItem[] = [
    {
      material: "Gas Kitting",
      colaborador: "G-7893",
      departamento: "IE Project Items",
      fechaAsignacion: "22 House Store",
      fechaEntrega: "1 pcs",
      observacion: "HQ",
      estado: "HQ",
      nombreHotel: "Hotel A",
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
              <h2>Asignación</h2>
              <button className="add-button">Agregar</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Colaborador</th>
                    <th>Departamento/Área</th>
                    <th>Fecha de Asignación</th>
                    <th>Fecha de entrega</th>
                    <th>Observación</th>
                    <th>Estado</th>
                    <th>Nombre de Hotel</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.material}</td>
                      <td>{item.colaborador}</td>
                      <td>{item.departamento}</td>
                      <td>{item.fechaAsignacion}</td>
                      <td>{item.fechaEntrega}</td>
                      <td>{item.observacion}</td>
                      <td>{item.estado}</td>
                      <td>{item.nombreHotel}</td>
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

export default Asignacion();

/*
  name: string;
  phone: string;
  address: string;
  email: string;
  rfc: string;
*/