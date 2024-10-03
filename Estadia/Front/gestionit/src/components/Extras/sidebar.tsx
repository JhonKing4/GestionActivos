import React from "react";
import { useLocation } from "react-router-dom";
import {
  Grid,
  Package,
  Truck,
  Building2,
  Hotel,
  Users,
  Drill,
} from "lucide-react";
import Logo from "../../assets/images/Majestic.png";

const Side = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo-container">
        <a href="/home" rel="noopener noreferrer">
          <img src={Logo} alt="Majestic Resorts Logo" className="logo" />
        </a>
      </div>

      <nav className="nav-menu">
        <a
          href="/asignacion"
          className={`nav-item ${
            location.pathname === "/asignacion" ? "active" : ""
          }`}
        >
          <Grid size={20} />
          <span>Asignaciones</span>
        </a>
        <a
          href="/material"
          className={`nav-item ${
            location.pathname === "/material" ? "active" : ""
          }`}
        >
          <Package size={20} />
          <span>Materiales</span>
        </a>
        <a
          href="/mantenimiento"
          className={`nav-item ${
            location.pathname === "/mantenimiento" ? "active" : ""
          }`}
        >
          <Drill size={20} />
          <span>Mantenimiento</span>
        </a>
        <a
          href="/proveedor"
          className={`nav-item ${
            location.pathname === "/proveedor" ? "active" : ""
          }`}
        >
          <Truck size={20} />
          <span>Proveedores</span>
        </a>
        <a
          href="/departamento"
          className={`nav-item ${
            location.pathname === "/departamento" ? "active" : ""
          }`}
        >
          <Building2 size={20} />
          <span>Departamentos</span>
        </a>
        <a
          href="/hotel"
          className={`nav-item ${
            location.pathname === "/hotel" ? "active" : ""
          }`}
        >
          <Hotel size={20} />
          <span>Hoteles</span>
        </a>
        <a
          href="/usuario"
          className={`nav-item ${
            location.pathname === "/usuario" ? "active" : ""
          }`}
        >
          <Users size={20} />
          <span>Usuarios</span>
        </a>
      </nav>
    </div>
  );
};

export default Side;
