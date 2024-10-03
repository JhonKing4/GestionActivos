import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Home from "./components/Home";
import Asignacion from "./components/asignaciones/Asignacion";
import Departamento from "./components/departamentos/Departamento";
import Hotel from "./components/hoteles/Hotel";
import Mantenimiento from "./components/mantenimiento/Mantenimiento";
import Material from "./components/materiales/Material";
import Proveedor from "./components/proveedores/Proveedor";
import Usuario from "./components/usuarios/Usuario";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login></Login>} />
          <Route path="/home" element={Home} />
          <Route path="/asignacion" element={Asignacion} />
          <Route path="/departamento" element={Departamento} />
          <Route path="/hotel" element={Hotel} />
          <Route path="/mantenimiento" element={Mantenimiento} />
          <Route path="/material" element={Material} />
          <Route path="/proveedor" element={Proveedor} />
          <Route path="/usuario" element={Usuario} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
