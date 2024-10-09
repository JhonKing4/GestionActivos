import React from "react";
import "../../styles/Header.css";
import { LogOut } from "lucide-react";

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <div className="header">
      <h1>Hola {userName}</h1>
      <button className="view-more red">
        <LogOut size={25} />
      </button>
    </div>
  );
};

export default Header;
