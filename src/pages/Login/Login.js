import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import "./Login.css";

const Login = ({ LogSucces }) => {
  const history = useHistory();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isVendedor, setIsVendedor] = useState(false);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const auth = JSON.parse(sessionStorage.getItem("auth"));
    const tipo = {
      C: () => history.push("/Lista"),
      V: () => {
          history.push("/Lista"),
        // setIsVendedor(true);
        pedirListaClientes(auth);
      },
      S: () => history.push("/Dashboard"),
    };
    if (auth) tipo[auth.TipoCliente]();
  }, []);

  const pedirListaClientes = async (auth) => {
    try {
      const result = await fetch(
        `${process.env.REACT_APP_BASE_URL}iClientesSP/ClientesDelVendedor?pUsuario=${auth.usuario}&pToken=${auth.Token}&pVendedor=${auth.IdCliente}`
      );
      if (result.status !== 200) {
        throw new Error(result.message);
      }

      const json = await result.json();

      setClientes(
        json.Clientes.map((cliente) => ({
          ...cliente,
          usuario: cliente.Usuario,
          TipoCliente: "C",
          isVendedor: true,
          vendedor: auth,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

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
        setIsVendedor(true);
        pedirListaClientes({ ...json, usuario: target[0].value });
      },
    };
    
    const { target } = e;

    setLoading(true);

    fetch(
      `${process.env.REACT_APP_BASE_URL}iClientesSP/ValidarCliente?pUsuario=${target[0].value}&pContrasenia=${target[1].value}`
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
        sessionStorage.setItem(
          "auth",
          JSON.stringify({ ...json, usuario: target[0].value })
        );

        tipo[json.TipoCliente](json, target);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container">
      <img src='/assets/images/logo/vaquero_quesos.jpg' alt="Logo Vaquero" />
      <hr />
      {isVendedor ? (
        <SelecionCliente clientes={clientes} LogSucces={LogSucces} />
      ) : (
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
      )}
    </div>
  );
};

export default Login;
