import React, { useEffect, useState } from "react"
import { DataGrid } from '@mui/x-data-grid'
import { Container, Text, Typography } from '@mui/material'


export default function ClientsTable ({ client }) {
    const [ data, setData ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        getBills(client)
        console.debug()
    }, [client])

    const getBills = async (client) =>{
        const clientId = client.IdCliente
    
        try {
            const auth = JSON.parse(sessionStorage.getItem("currentUser"));
    
            const result = await fetch(`${process.env.REACT_APP_BASE_URL}iClientesSP/CuentasCorrientesVendedor?pUsuario=${auth.usuario}&pToken=${auth.Token}&pIdCliente=${clientId}`)
            
            const bills = await result.json()
    
            console.debug('getBills', bills)
            setData(bills)
        } catch (error) {
            
        }
        finally {
            setIsLoading(false)
        }
    }

    const columns = [
        {
            headerName: 'Comprobante N°',
            field: 'Comprobante',
            sortable: true,
            width: 250,
            headerAlign: 'center',
            align:'center'
        },
        {
            headerName: 'Importe ',
            field: 'Importe',
            sortable: true,
            width: 250,
            headerAlign: 'center',
            align:'center'
        },
        {
            headerName: 'Fecha de vencimiento',
            field: 'FechaVencimiento',
            sortable: true,
            width: 250,
            headerAlign: 'center',
            align:'center'
        },
        {
            headerName: 'Dias de mora',
            field: 'DiasMora',
            sortable: true,
            width: 250,
            headerAlign: 'center',
            align:'center'
        },
    ]

return (
    <DataGrid
        rows={data}
        columns={columns}
        loading={isLoading}
        getRowId={row => row.$id}
        nonce="No hay datos"
        getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton',
            },
        }}
        slots={{
            noRowsOverlay: () => (
                <Container>
                    <Typography variant="h4" gutterBottom>
                        h4. Heading
                    </Typography>
                </Container>
            )
        }}
    />
)}