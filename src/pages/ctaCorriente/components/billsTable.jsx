import React, { useEffect, useState } from "react"
import { getClientBills } from "../../../services/client.service";
import CustomTable from "../../../components/customTable";
import { TextField } from "@mui/material";
import moment from "moment/moment";

let origData = []

export default function ClientsTable ({ client }) {
    const [ data, setData ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)

    const formateDateFromIso = isoDate => {
        if(!isoDate) return ''
        const date = new Date(isoDate)
        return moment(date).format('DD/MM/YYYY')
    }

    const parseAmount = (amount) => {
        return amount && amount >= 0
        ? `$${amount.toLocaleString('es-AR')}`
        : amount
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
            valueGetter: (value) => parseAmount(value),
        },
        {
            headerName: 'Fecha de creacion',
            field: 'Fecha',
            sortable: true,
            width: 250,
            headerAlign: 'center',
            align:'center',
            valueGetter: (value) => formateDateFromIso(value)
        },
        {
            headerName: 'Fecha de vencimiento',
            field: 'FechaVencimiento',
            sortable: true,
            width: 250,
            headerAlign: 'center',
            align:'center',
            valueGetter: (value) => formateDateFromIso(value)
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

    useEffect(() => {
        if(!client) return
        setIsLoading(true)
        getBills(client)
    }, [client])


    const getBills = async (client) =>{
        const res = await getClientBills({ client })
        origData = JSON.parse(JSON.stringify(res))
        setData(res)
        setIsLoading(false)
    }

    const handleFilter = (evt) => {
        const text = evt.target.value || ''
    
        if(!text.length) {
            setData(origData)
            return 
        }


        const filtered = data.filter( bill => {
                const ticket = bill.Comprobante?.toString()?.includes(text)
                const amount = bill.Importe?.toString()?.includes(text)
                const billDate = bill.Fecha && formateDateFromIso(bill.Fecha)?.toString()?.includes(text)
                const billExp = bill.FechaVencimiento && formateDateFromIso(bill.FechaVencimiento)?.toString()?.includes(text)
            return ticket ||  amount || billDate || billExp
        })
        setData(filtered)
    }

return (
    <>
        <TextField label="Busqueda" variant="outlined" onChange={handleFilter} />
        <hr />
        <CustomTable 
            columns={columns}
            rows={data}
            isLoading={isLoading}
        />
    </>
)}