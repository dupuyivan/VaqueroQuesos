import React, { useEffect, useState } from "react"
import { getClientBills } from "../../../services/client.service";
import CustomTable from "../../../components/customTable";

export default function ClientsTable ({ client }) {
    const [ data, setData ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
        if(!client) return
        setIsLoading(true)
        getBills(client)
    }, [client])


    const getBills = async (client) =>{
        const res = await getClientBills({ client })        
        setData(res)
        setIsLoading(false)
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
            align:'center',
            valueGetter: (value) => {                
                return value && value >= 0
                    ? `$${value.toLocaleString('es-AR')}`
                    : value
            },
        },
        {
            headerName: 'Fecha de vencimiento',
            field: 'FechaVencimiento',
            sortable: true,
            width: 250,
            headerAlign: 'center',
            align:'center',
            valueGetter: (value) => {                
                const date = new Date(value)

                return date
                    ? `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
                    : date
            },
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
    <CustomTable 
        columns={columns}
        rows={data}
        isLoading={isLoading}
    />
)}