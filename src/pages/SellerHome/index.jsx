import React, { useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'
import { BASE_URL } from "../../BaseURL.json";

const SelecionCliente = ({ clientes, LogSucces }) => {
    const history = useHistory();
    const [clienteSeleccionado, setClienteSeleccionado] = useState(0);
    const [clientesFiltrados, setClientesFiltrados] = useState(clientes);
  
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

export default function SellerHome ({ LogSucces }) {
    const history = useHistory();
    const [showClientSelection, setShowClientSelection ] = useState(false)
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const auth = JSON.parse(sessionStorage.getItem("auth"));
        pedirListaClientes(auth);
      }, []);
    
      const pedirListaClientes = async (auth) => {
        try {
          const result = await fetch(
            `${BASE_URL}iClientesSP/ClientesDelVendedor?pUsuario=${auth.usuario}&pToken=${auth.Token}&pVendedor=${auth.IdCliente}`
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


return (
      <div className="container">
        <div style={{ display: "flex", flexDirection: 'row' }}>
            <button className="button" onClick={() => setShowClientSelection(!showClientSelection)}>
            Cargar pedido
            </button>

            <button className="button" onClick={() => history.push("/cuentaCorriente")}>
            Consultar cuenta corriente
            </button>

            <button className="button" onClick={() => history.push("/estadoPedido")}>
            Ver estado de un pedido
            </button>
        </div>
        
            { 
                showClientSelection
                && (
                        <SelecionCliente clientes={clientes} LogSucces={LogSucces} />
                    )
            }
    </div>
)}
