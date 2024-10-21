import React, { useState } from "react";
import './style.css'
import Header from "../../components/header";
import { Autocomplete, TextField, Container } from "@mui/material";
import useClients from "../../hooks/useClients";
import BillsTable from './components/billsTable'


export default function CuentaCorriente () {
    const { clients } = useClients()
    const [selectedClient, setSelectedClient] = useState()

    const handleSelect = (val) => {
        setSelectedClient(val)
    }

    const renderInput = params => <TextField {...params} label="Elige un cliente" />

return( 
    <Container maxWidth="xl">
        <Header pageName='Cuenta corriente' />
        <div style={{ display: 'flex',  justifyContent:'center' }}>
            <Autocomplete
                onChange={(_, newVal) => handleSelect(newVal)}
                disablePortal
                options={clients}
                getOptionLabel={(option) => option.Nombre}
                getOptionKey={(option) => option.$id}
                renderInput={renderInput}
                sx={{ width: 600 }}
            />
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

