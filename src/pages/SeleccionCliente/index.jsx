import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Container } from "@mui/material";


export default function Seleccioncliente ({ clientes, LogSucces }) {
    const history = useHistory();
    const [clienteSeleccionado, setClienteSeleccionado] = useState(0);
    const [clientesFiltrados, setClientesFiltrados] = useState(clientes);

    useEffect(() => {
        setClientesFiltrados(clientes);
    }, [clientes]);

    const handleClick = (e) => {
      const Cliente = clientesFiltrados[clienteSeleccionado];
      sessionStorage.removeItem("auth");
      sessionStorage.setItem("auth", JSON.stringify({ ...Cliente }));
      LogSucces();
      history.push("/Lista");
    };

    const filtrarPedidoPorCliente = (value, clientes) => {
      return clientes.filter((cliente) =>
        cliente.Nombre.toLowerCase().includes(value.toLowerCase())
      );
    };

    const filtrar = (value, pedidos) => {
      return filtrarPedidoPorCliente(value, pedidos);
    };

    const handleChangeFiltro = (e) => {
      const resultado = filtrar(e.target.value, clientes);
      if (!resultado) return;
      setClientesFiltrados(resultado);
    };

    const handleChangeSelect = (e) => {
      const { value } = e.target;
      setClienteSeleccionado(value);
    };

    return (
        <>
        <div className="container">
          <input
            type="text"
            className="inputLogin"
            placeholder="Filtro"
            onChange={handleChangeFiltro}
          />
          <small>Seleccione un usuario para continuar.</small>
          <select
            className="usuario"
            value={clienteSeleccionado}
            onChange={handleChangeSelect}
          >
            {clientesFiltrados.map((cliente, i) => (
              <option value={i} key={i}>
                {cliente.Nombre}
              </option>
            ))}
          </select>
          <button className="button" onClick={handleClick}>
            Seleccionar
          </button>
        </div>
      </>
    )
}