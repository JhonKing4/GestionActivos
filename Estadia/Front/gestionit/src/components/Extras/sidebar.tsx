import React from 'react';
import { 
  Grid,
  Package,
  Truck,
  Building2,
  Hotel,
  Users,
  Drill
} from 'lucide-react';
const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img
          src="/api/placeholder/150/30"
          alt="Majestic Resorts Logo"
          className="logo"
        />
      </div>

      <nav className="nav-menu">
        <a href="#" className="nav-item active">
          <Grid size={20} />
          <span>Asignaciones</span>
        </a>
        <a href="#" className="nav-item">
          <Package size={20} />
          <span>Materiales</span>
        </a>
        <a href="#" className="nav-item">
          <Drill size={20} />
          <span>Mantenimiento</span>
        </a>
        <a href="#" className="nav-item">
          <Truck size={20} />
          <span>Proveedores</span>
        </a>
        <a href="#" className="nav-item">
          <Building2 size={20} />
          <span>Departamentos</span>
        </a>
        <a href="#" className="nav-item">
          <Hotel size={20} />
          <span>Hoteles</span>
        </a>
        <a href="#" className="nav-item">
          <Users size={20} />
          <span>Usuarios</span>
        </a>
      </nav>
    </div>
  );
};
export default Sidebar();
