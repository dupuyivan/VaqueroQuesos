import React, { useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'
import SelecionCliente from './components/clientSelection.jsx'
import useClients from "../../hooks/useClients.js"

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
    const { clients } = useClients()

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
                        <SelecionCliente clientes={clients} LogSucces={LogSucces} />
                    )
            }
    </div>
)}
