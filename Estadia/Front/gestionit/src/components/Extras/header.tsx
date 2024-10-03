import React from 'react';
import '../../styles/Header.css'

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <div className="header">
      <h1>Hola {userName}</h1>
      <button className="view-more">Ver más...</button>
    </div>
  );
};

export default Header;