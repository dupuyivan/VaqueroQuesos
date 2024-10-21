import React, { useState } from "react"
import { Container } from "@mui/material"
import Header from "../../components/header"
import useClients from "../../hooks/useClients"
import SelectClient from "../../components/selectClient"
import OrdersTable from "./components/OrdersTable"

export default function EstadoPedido () {
    const { clients } = useClients()
    const [selectedClient, setSelectedClient] = useState()

    const handleSelect = (val) => {
        if(!val) return setSelectedClient()
        setSelectedClient(val)
    }

return (
    <Container maxWidth="xl">
        <Header pageName='Estado pedido' />
        <div style={{ display: 'flex',  justifyContent:'center' }}>
            <SelectClient options={clients} onChange={handleSelect} />
        </div>
        <div style={{ display: 'flex',  justifyContent:'center', marginTop: '2rem'}}>
            <div style={{ width: '90%', minHeight:'25rem', }}>
            {
                selectedClient 
                    &&  <OrdersTable client={selectedClient} />
            }
            </div>
        </div>
    </Container>
)}