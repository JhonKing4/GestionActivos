import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Tabla.css";

interface AssignmentItem {
  nombre: string;
}

const Hotel = () => {
  const assignmentData: AssignmentItem[] = [
    {
      nombre: "Majestic",
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
              <h2>Hoteles</h2>
              <button className="add-button">Agregar</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre}</td>
                      <td>
                        <div className="action-buttons">
                          <div className="action-btn yellow">
                            <Pencil size={18} />
                          </div>
                          <div className="action-btn red">
                            <Trash2 size={18} />
                          </div>
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

export default Hotel();