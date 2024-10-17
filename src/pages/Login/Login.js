import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import "./Login.css";

const BASE_URL = process.env.REACT_APP_BASE_URL

const Login = ({ logo, LogSucces }) => {
  const history = useHistory();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const auth = JSON.parse(sessionStorage.getItem("auth"));
    const tipo = {
      C: () => history.push("/Lista"),
      V: () => {
        redirectToSellersHome()
      },
      S: () => history.push("/Dashboard"),
    };
    if (auth) tipo[auth.TipoCliente]();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const tipo = {
      S: () => {
        LogSucces();
        history.push("/Dashboard");
      },
      C: () => {
        LogSucces();
        history.push("/Lista");
      },
      V: (json, target) => {
        redirectToSellersHome()
      },

    };
    
    const { target } = e;
    setLoading(true);
    fetch(
      `${BASE_URL}iClientesSP/ValidarCliente?pUsuario=${target[0].value}&pContrasenia=${target[1].value}`
    )
      .then((result) => {
        if (result.status !== 200) {
          throw new Error("usuario o contraseña incorrecta.");
        }
        return result.json();
      })
      .then((json) => {
        if (json.IdCliente === 0 || json.Inactivo) {
          target[1].value = "";
          throw new Error("usuario o contraseña incorrecta.");
        }
        setError(null);

        const currentUser = JSON.stringify({ ...json, usuario: target[0].value })

        sessionStorage.setItem(
          "auth",
          currentUser
        );

        sessionStorage.setItem('currentUser', currentUser)
        tipo[json.TipoCliente](json, target);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const redirectToSellersHome = () => {
    history.push('/vendedor')
  }

  return (
    <div className="container">
      <img src={logo} alt="Logo Vaquero" />
      <hr />
      <form onSubmit={handleSubmit} className="container">
        <span className="error">{error}</span>
        <input
          required
          className="usuario"
          type="text"
          placeholder="Usuario"
        />
        <input
          required
          className="contraseña"
          type="password"
          placeholder="Contraseña"
        />
        <button disabled={isLoading} className="button">
          ENVIAR
        </button>
        <small className="cuenta">
          Si no tiene una cuenta puede comunicarse a <br />
          <span>
            <a className="email" href="mailto:ventas@quesosvaquero.com">
              ventas@quesosvaquero.com
            </a>
          </span>
        </small>
      </form>
    </div>
  );
};

export default Login;
