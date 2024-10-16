import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Package2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Sidebar.css";
import Header from "./Extras/header";
import Side from "./Extras/sidebar";

interface Material {
  idMaterial: string;
  name: string;
  stock: number;
  serial_number: string;
  hotel: {
    name: string;
  };
}

interface Asignacion {
  idAsignacion: string;
  hotel: {
    name: string;
  };
  usuario: {
    name: string;
  };
  material: Material[];
}

const getRandomItems = <T,>(arr: T[], num: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const Home = () => {
  const [materialData, setMaterialData] = useState<Material[]>([]);
  const [assignmentData, setAssignmentData] = useState<Asignacion[]>([]);
  const navigate = useNavigate();

  const fetchMaterialData = async () => {
    try {
      const response = await axios.get<Material[]>(
        "http://localhost:3001/material"
      );
      setMaterialData(response.data);
    } catch (error) {
      console.error("Error al obtener los materiales:", error);
    }
  };

  const fetchAssignmentData = async () => {
    try {
      const response = await axios.get<Asignacion[]>(
        "http://localhost:3001/asignacion"
      );
      setAssignmentData(response.data);
    } catch (error) {
      console.error("Error al obtener las asignaciones:", error);
    }
  };

  useEffect(() => {
    fetchMaterialData();
    fetchAssignmentData();
  }, []);

  const randomMaterials = getRandomItems(materialData, 3);
  const randomAssignments = getRandomItems(assignmentData, 3);

  const countAssignedMaterials = () => assignmentData.length;
  const countUnassignedMaterials = () =>
    materialData.length - assignmentData.length;

  const countStockMaterials = () =>
    materialData.filter((item) => item.stock > 0).length;
  const countOutOfStockMaterials = () =>
    materialData.filter((item) => item.stock === 0).length;

  return (
    <div className="app-container">
      <Side />
      <div className="main-content">
        <Header userName="Jhoandi" />
        <div className="home-content">
          <div className="tables-container">
            <div className="table-section">
              <div className="section-header">
                <h2>Materiales</h2>
                <button
                  className="view-more"
                  onClick={() => navigate("/material")}
                >
                  Ver más...
                </button>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Numero de serie</th>
                      <th>Hotel</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {randomMaterials.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.serial_number}</td>
                        <td>{item.hotel.name}</td>
                        <td>{item.stock} pcs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="table-section">
              <div className="section-header">
                <h2>Asignaciones</h2>
                <button
                  className="view-more"
                  onClick={() => navigate("/asignacion")}
                >
                  Ver más...
                </button>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Colaborador</th>
                      <th>Hotel</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {randomAssignments.map((item, index) => (
                      <tr key={index}>
                        <td>{item.material[0]?.name}</td>
                        <td>{item.usuario.name}</td>
                        <td>{item.hotel.name}</td>
                        <td>{item.material.length} pcs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="stats-container">
            <div className="stat-card">
              <Package2 className="stat-icon blue" />
              <div className="stat-number">{countAssignedMaterials()}</div>
              <div className="stat-label">Asignados</div>
            </div>
            <div className="stat-card">
              <Users className="stat-icon purple" />
              <div className="stat-number">{countUnassignedMaterials()}</div>
              <div className="stat-label">No asignados</div>
            </div>
            <div className="stat-card">
              <Package className="stat-icon green" />
              <div className="stat-number">{countStockMaterials()}</div>
              <div className="stat-label">Materiales con stock</div>
            </div>
            <div className="stat-card">
              <Package className="stat-icon red" />
              <div className="stat-number">{countOutOfStockMaterials()}</div>
              <div className="stat-label">Materiales sin stock</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
