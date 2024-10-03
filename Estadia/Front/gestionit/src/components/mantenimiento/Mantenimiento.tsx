import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Tabla.css";

interface AssignmentItem {
  descripcion: string;
  startDate: string;
  endDate: string;
  typeMaintenance: string;
  material: string;
}

const Mantenimiento = () => {
  const assignmentData: AssignmentItem[] = [
    {
      descripcion: "Se tiene que hacer este tipo de mantenimiento",
      startDate: "2023-02-06",
      endDate: "2024-05-03",
      typeMaintenance: "Preventivo",
      material: "Laptop HP",
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
              <h2>Mantenimientos</h2>
              <button className="add-button">Agregar</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Descripción</th>
                    <th>Tipo de mantenimiento</th>
                    <th>Fecha de Inicio</th>
                    <th>Fecha de finalización</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.material}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.typeMaintenance}</td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
                      <td>
                        <div className="action-buttons">
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

export default Mantenimiento();
