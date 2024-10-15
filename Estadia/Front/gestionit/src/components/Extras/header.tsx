import React from "react";
import "../../styles/Header.css";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <h1>Hola {userName}</h1>
      <button className="view-more red" onClick={() => navigate("/?")}>
        <LogOut size={25} />
      </button>
    </div>
  );
};

export default Header;
