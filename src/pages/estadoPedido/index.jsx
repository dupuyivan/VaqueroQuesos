import React, { useEffect, useState } from "react"
import { Autocomplete, Container, TextField } from "@mui/material"
import Header from "../../components/header"
import useClients from "../../hooks/useClients"
import { DataGrid } from "@mui/x-data-grid"

function OrdersTable ({ client }) {
    const [ data, setData ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)

    const columns = [
        {
            headerName: 'Pedido N°',
            field: 'Pedido',
            sortable: true,
            width: 200,
            headerAlign: 'center',
            align:'center'
        },
        {
            headerName: 'Nombre producto',
            field: 'Producto',
            sortable: true,
            width: 250,
            headerAlign: 'center',
            align:'center'

        },
        {
            headerName: 'Cantidad pedida',
            field: 'CantidadPedida',
            sortable: true,
            width: 200,
            headerAlign: 'center',
            align:'center'
        },
        {
            headerName: 'Cantidad a preparar',
            field: 'CantidadAPreparar',
            sortable: true,
            width: 200,
            headerAlign: 'center',
            align:'center'

        },
        {
            headerName: 'Cantidad preparada',
            field: 'CantidadPreparados',
            sortable: true,
            width: 200,
            headerAlign: 'center',
            align:'center'

        },
        {
            headerName: 'Unidades preparadas',
            field: 'Avance',
            sortable: true,
            width: 200,
            headerAlign: 'center',
            align:'center'
        },
    ]

    useEffect(() => {
        getData()
    }, [client])

    const getData = async () => {
        const data = await getOrderStatusByClient(client)
        setData(data)
        setIsLoading(false)
    }

return (
    <DataGrid
        columns={columns}
        rows={data}
        loading={isLoading}
        getRowId={row => row.$id}
        getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton',
            },
        }}
    />
)}

const getOrderStatusByClient = async (client) =>{
    const since = '2023-01-01'
    const until = '2025-01-01'
    const clientId = client.IdCliente

    try {
        const auth = JSON.parse(sessionStorage.getItem("currentUser"));

        const result = await fetch(`${process.env.REACT_APP_BASE_URL}/iPedidosSP/PedidosPorEstadoCliente?pUsuario=${auth.usuario}&pToken=${auth.Token}&pFechaDesde=${since}&pFechaHasta=${until}&pIdCliente=${clientId}`)
        
        const orders = await result.json()

        console.debug('getOrderStatusByClient', orders)

        return orders
    } catch (error) {
        
    }
}

export default function EstadoPedido () {
    const { clients } = useClients()
    const [selectedClient, setSelectedClient] = useState()

    const handleSelect = (val) => {
        if(!val) return setSelectedClient()
        
        setSelectedClient(val)
    }

    const renderInput = params => <TextField {...params} label="Elige un cliente" />

return (
    <Container maxWidth="xl">
        <Header pageName='Estado pedido' />
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
            <div style={{ width: '90%', minHeight:'25rem', }}>
            {
                selectedClient 
                    &&  <OrdersTable client={selectedClient} />
            }
            </div>
        </div>
    </Container>
)}