import React from "react"
import { DataGrid } from '@mui/x-data-grid'


export default function ClientsTable ({ bills }) {
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