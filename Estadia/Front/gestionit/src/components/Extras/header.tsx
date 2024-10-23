import React, { useEffect, useState } from "react";
import "../../styles/Header.css";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/?");
  };

  return (
    <div className="header">
      <h1>Hola {userName}</h1>
      <button className="view-more red" onClick={handleLogout}>
        <LogOut size={25} />
      </button>
    </div>
  );
};

export default Header;
