import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import Majestic from "../../assets/images/MajesticInicio.jpg";
import Logo from "../../assets/images/Majestic.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Enviando petición...");
      const response = await axios.post("http://localhost:3001/usuario/login", {
        email,
        password,
      });

      console.log("Respuesta recibida:", response.data);

      navigate("/home");
    } catch (err: unknown) {
      console.log("Error en la solicitud:", err);

      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 400) {
          setError("Credenciales incorrectas");
        } else {
          setError("Error en la conexión con el servidor");
        }
      } else {
        setError("Ocurrió un error desconocido");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-container">
        <img
          src={Majestic}
          alt="Majestic Resort"
          className="login-resort-image"
        />
      </div>

      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-logo-container">
            <img
              src={Logo}
              alt="Majestic Resorts Logo"
              className="login-logo-image"
            />
          </div>

          <h2 className="login-welcome-text">Bienvenido 👋</h2>
          <p className="login-subtitle">Por favor inicie sesión aquí</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email" className="login-label">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-label">
                Contraseña
              </label>
              <div className="login-password-input-container">
                <input
                  type="password"
                  id="password"
                  placeholder="*******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                />
                <button
                  type="button"
                  className="login-toggle-password"
                ></button>
              </div>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>

            {error && <p className="login-error-message">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
