import { Pencil, Trash2 } from "lucide-react";
import Header from "../Extras/header";
import Side from "../Extras/sidebar";
import "../../styles/Tabla.css"

interface AssignmentItem {
  nombre: string;
  correo: string;
  contraseña: string;
  rol: string;
}

const Usuario = () => {
  const assignmentData: AssignmentItem[] = [
    {
      nombre: "Jhoandi Abraham Ciau Cetz",
      correo: "jhoandiciaucetz@gmail.com",
      contraseña: "12345",
      rol: "Admin",
    },
  ];
  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header userName="Jhonadi" />
        <div className="tabla-content">
          <div className="table-section">
            <div className="section-header">
              <h2>Usuarios</h2>
              <button className="add-button">Agregar</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Contraseña</th>
                    <th>Rol</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre}</td>
                      <td>{item.correo}</td>
                      <td>{item.contraseña}</td>
                      <td>{item.rol}</td>
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

export default Usuario();
