import React, { useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'

export default function SelecionCliente ({ clientes, LogSucces }) {
    const history = useHistory();
    const [clienteSeleccionado, setClienteSeleccionado] = useState(0);
    const [clientesFiltrados, setClientesFiltrados] = useState(clientes);
  
    const handleClick = (e) => {
      const Cliente = clientesFiltrados[clienteSeleccionado];

      console.debug('Cliente', Cliente)
      
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
  
    useEffect(() => {
      setClientesFiltrados(clientes);
    }, [clientes]);
  
    return (
      <>
        <div className="container">
          <div  className="container" style={{ marginTop: '2rem' }}>
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
        </div>
      </>
    );
};