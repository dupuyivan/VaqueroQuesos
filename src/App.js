import React, { useState, useEffect } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [usuario, setUsuario] = useState();

  useEffect(() => {
    LogSucces();
  }, []);
  const LogSucces = () => {
    const user = JSON.parse(sessionStorage.getItem("auth"));
    setUsuario(user);
  };

  return (
    <RouterProvider router={router} />
  );
}

const BasePage = ({ children, titulo, usuario = {}, LogSucces }) => {
  const handleSwitch = (e) => {
    sessionStorage.setItem("auth", JSON.stringify({ ...usuario.vendedor }));
  };
  useEffect(() => {
    if (!usuario.Token) {
      LogSucces();
    }
  }, []);
  return (
    <>
      <div className="botonesNav">
        <span>Cliente: {usuario?.Nombre}</span>
        <Link to="/Logout">
          <i className="fas fa-sign-out-alt"></i>
        </Link>
        {usuario.isVendedor && (
          <Link to="/" onClick={handleSwitch}>
            <i className="fas fa-random"></i>
          </Link>
        )}
      </div>
      <div className="contenedor__landing">
        <img src='/assets/images/logo/vaquero_quesos.jpg' alt="Logo Vaquero" />

        <div className="contenedor__titulo">
          <h2>{titulo}</h2>
          <hr />
        </div>
      </div>

      <div className="contenedor__lista">{children}</div>
    </>
  );
};

const Logout = () => {
  const history = useHistory();
  useEffect(() => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("carrito");

    history.push("/");
  }, []);
  return "";
};

export default App;

/* 
   <BrowserRouter>
      <div className="contenedor">
        <Switch>
          <Route exact path="/Lista">
            <BasePage
              LogSucces={LogSucces}
              usuario={usuario}
              titulo="Realizar Pedido"
            >
              <Lista />
            </BasePage>
          </Route>

          <Route exact path="/Carrito">
            <BasePage
              LogSucces={LogSucces}
              usuario={usuario}
              titulo={`CARRITO - ${usuario?.Nombre} `}
            >
              <Carrito />
            </BasePage>
          </Route>

          <Route path="/Dashboard">
            <GetPedidosProvider>
              <Dashboard usuario={usuario} />
            </GetPedidosProvider>
          </Route>
          <Route exact path="/Logout">
            <Logout />
          </Route>
          <Route exact path="/">
            <Login LogSucces={LogSucces} />
          </Route>
          <Redirect to="/" />
        </Switch>
        <ToastContainer />
      </div>
    </BrowserRouter>

*/