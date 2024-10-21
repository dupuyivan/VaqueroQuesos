import React, { useState } from "react";
import './style.css'
import Header from "../../components/header";
import { Container } from "@mui/material";
import useClients from "../../hooks/useClients";
import BillsTable from './components/billsTable'
import SelectClient from "../../components/selectClient";

export default function CuentaCorriente () {
    const { clients } = useClients()
    const [selectedClient, setSelectedClient] = useState()

    const handleSelect = (val) => {
        setSelectedClient(val)
    }

return( 
    <Container maxWidth="xl">
        <Header pageName='Cuenta corriente' />
        <div style={{ display: 'flex',  justifyContent:'center' }}>
            <SelectClient options={clients} onChange={handleSelect} />
        </div>
        <div style={{ display: 'flex',  justifyContent:'center', marginTop: '2rem'}}>
            <div style={{ width: '75%', minHeight:'25rem', }}>
            {
                selectedClient 
                    &&  <BillsTable client={selectedClient} />
            }
            </div>
        </div>
    </Container>
)}

