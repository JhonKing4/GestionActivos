import { Package, Package2, Users } from "lucide-react";
import React from "react";
import "../styles/Home.css";
import "../styles/Sidebar.css";
import Header from "./Extras/header";
import Side from "./Extras/sidebar";

const materialData = [
  { itemName: "Gas Lifting", store: "Z7 House Store", amount: "1 pcs" },
  { itemName: "Candet", store: "HQ Main Store", amount: "3 pcs" },
  { itemName: "Candet", store: "HQ Main Store", amount: "5 pcs" },
  { itemName: "Candet", store: "HQ Main Store", amount: "5 pcs" },
];

const assignmentData = [
  { assetName: "Gas Lifting", store: "Z7 House Store", amount: "1 pcs" },
  { assetName: "Candet", store: "HQ Main Store", amount: "3 pcs" },
  { assetName: "Candet", store: "HQ Main Store", amount: "5 pcs" },
  { assetName: "Candet", store: "HQ Main Store", amount: "5 pcs" },
];

const Home = () => {
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
                <button className="view-more">Ver más...</button>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ITEM NAME</th>
                      <th>IMAGE</th>
                      <th>STORE</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.itemName}</td>
                        <td>
                          <div className="table-image"></div>
                        </td>
                        <td>{item.store}</td>
                        <td>{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="table-section">
              <div className="section-header">
                <h2>Asignaciones</h2>
                <button className="view-more">Ver más...</button>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ASSET NAME</th>
                      <th>IMAGE</th>
                      <th>STORE</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.assetName}</td>
                        <td>
                          <div className="table-image"></div>
                        </td>
                        <td>{item.store}</td>
                        <td>{item.amount}</td>
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
              <div className="stat-number">868</div>
              <div className="stat-label">Asignados</div>
            </div>
            <div className="stat-card">
              <Users className="stat-icon purple" />
              <div className="stat-number">200</div>
              <div className="stat-label">No asignados</div>
            </div>
            <div className="stat-card">
              <Package className="stat-icon green" />
              <div className="stat-number">31</div>
              <div className="stat-label">Materiales con stock</div>
            </div>
            <div className="stat-card">
              <Package className="stat-icon red" />
              <div className="stat-number">21</div>
              <div className="stat-label">Materiales sin stock</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home();
