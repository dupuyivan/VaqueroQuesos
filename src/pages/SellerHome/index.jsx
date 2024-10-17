import React, { useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'
import SelecionCliente from './components/clientSelection.jsx'

const BASE_URL = process.env.REACT_APP_BASE_URL

const getMyClientsFromStorage = () => {
    const clients = localStorage.getItem('myClients') 

    return clients
        ?  JSON.parse(clients)
        : []
}

export default function SellerHome ({ LogSucces }) {
    const history = useHistory();
    const [showClientSelection, setShowClientSelection ] = useState(false)
    const [clientes, setClientes] = useState( getMyClientsFromStorage() );

    useEffect(() => {
        if(clientes.length) return
        const auth = JSON.parse(sessionStorage.getItem("currentUser"));
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
    
          const clients = json.Clientes.map((cliente) => ({
            ...cliente,
            usuario: cliente.Usuario,
            TipoCliente: "C",
            isVendedor: true,
            vendedor: auth,
          }))

          localStorage.setItem('myClients', JSON.stringify(clients))
          setClientes(clients);
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
