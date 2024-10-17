import { useEffect, useState } from "react";
import './style.css'
import Header from "../../components/header";
import { Autocomplete, TextField, Container } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

const clientsData = [
    {
        id: '1',
        name: 'ARIEL LAFFLITTO',
        bills: [
            {
                id:'1',
                receiptId: 'PPTO-0000-00007622',
                amount: '4.030.941,30',
                expirationDate: '04/09/2024',
                moraInDays: 29
            },
            {
                id:'2',
                receiptId: 'PPTO-0000-00007645',
                amount: '2.680.360,60 ',
                expirationDate: '06/09/2024',
                moraInDays: 27
            },
            {
                id:'3',
                receiptId: 'PPTO-0000-00007663',
                amount: '131.887,57 ',
                expirationDate: '10/09/2024',
                moraInDays: 23
            },
            {
                id:'4',
                receiptId: 'PPTO-0000-0000762293y438',
                amount: '4.030.941,30',
                expirationDate: '04/09/2024',
                moraInDays: 29
            },
            {
                id:'5',
                receiptId: 'PPTO-0000-9854234',
                amount: '2.680.360,60',
                expirationDate: '06/10/2024',
                moraInDays: 27
            },
            {
                id:'6',
                receiptId: 'PPTO-0000-0000766328946',
                amount: '131.887,57 ',
                expirationDate: '10/11/2024',
                moraInDays: 23
            },
        ]
    },
    {
        id: '2',
        name: 'BOGILCA S.R.L.',
        bills: [
            {
                id:'1',
                receiptId: 'X-0006-00009494',
                amount: '-232.278,96',
                expirationDate: '05/08/2024',
                moraInDays: 59
            },
        ]
    },
]


function ClientsTable ({ bills }) {
    const columns = [
        {
            field: 'receiptId',
            headerName: 'Comprobante N°',
            sortable: true,
            width: 200,
            headerAlign: 'center',
        },
        {
            field: 'amount',
            headerName: 'Importe',
            sortable: true,
            width: 200,
            headerAlign: 'center',
        },
        {
            field: 'expirationDate',
            headerName: 'Vencimiento',
            sortable: true,
            width: 200,
            headerAlign: 'center',
        },
        {
            field: 'moraInDays',
            headerName: 'Mora',
            sortable: true,
            width: 200,
            headerAlign: 'center',
        },
    ]

return (
    <DataGrid
        rows={bills}
        columns={columns}
        pageSizeOptions={[0]}
        getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
    />
)}

export default function CuentaCorriente () {
    const [clients, setClients] = useState([])
    const [selectedClient, setSelectedClient] = useState()

    useEffect(() => {
        setClients(
            clientsData.map( client =>({ id: client.id, label: client.name }))
        )
    }, [])

    const handleSelect = (val) => {
        if(!val) return setSelectedClient()
        const clientFound = clientsData.find( client => client.id === val.id )
        setSelectedClient(clientFound)
    }

    const renderInput = params => <TextField {...params} label="Elige un cliente" />

return( 
    <Container maxWidth="xl">
        <Header />
        <div style={{ display: 'flex',  justifyContent:'center' }}>
            <Autocomplete
                onChange={(_, newVal) => handleSelect(newVal)}
                disablePortal
                options={clients}
                sx={{ width: 300 }}
                renderInput={renderInput}
            />
        </div>
        <div style={{ display: 'flex',  justifyContent:'center', marginTop: '2rem'}}>
            <div style={{ width: '75%', minHeight:'25rem', }}>
            {
                selectedClient 
                    &&  <ClientsTable bills={selectedClient.bills} />
            }
            </div>
        </div>
    </Container>
)}

