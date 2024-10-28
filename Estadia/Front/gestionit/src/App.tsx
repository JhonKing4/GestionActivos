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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/asignacion"
            element={
              <ProtectedRoute>
                <Asignacion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departamento"
            element={
              <ProtectedRoute>
                <Departamento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel"
            element={
              <ProtectedRoute>
                <Hotel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mantenimiento"
            element={
              <ProtectedRoute>
                <Mantenimiento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/material"
            element={
              <ProtectedRoute>
                <Material />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedor"
            element={
              <ProtectedRoute>
                <Proveedor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuario"
            element={
              <ProtectedRoute>
                <Usuario />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
