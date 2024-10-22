import React, { useEffect, useState } from "react"
import moment from "moment/moment"
import CustomTable from "../../../components/customTable"
import { getOrdersByClientAndRange } from "../../../services/orders.service"
import { TextField } from "@mui/material"

let origData = []

export default function OrdersTable ({ client }) {
    const [ data, setData ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)

    const columns = [
        {
            headerName: 'Pedido N°',
            field: 'Pedido',
            sortable: true,
            flex: 1,
            headerAlign: 'center',
            align:'center'
        },
        {
            headerName: 'Nombre producto',
            field: 'Producto',
            sortable: true,
            flex: 1,
            headerAlign: 'center',
            align:'center'

        },
        {
            headerName: 'Cantidad pedida',
            field: 'CantidadPedida',
            sortable: true,
            flex: 1,
            headerAlign: 'center',
            align:'center'
        },
        {
            headerName: 'Cantidad a preparar',
            field: 'CantidadAPreparar',
            sortable: true,
            flex: 1,
            headerAlign: 'center',
            align:'center'

        },
        {
            headerName: 'Cantidad preparada',
            field: 'CantidadPreparados',
            sortable: true,
            flex: 1,
            headerAlign: 'center',
            align:'center'

        },
        {
            headerName: 'Unidades preparadas',
            field: 'Avance',
            sortable: true,
            flex: 1,
            headerAlign: 'center',
            align:'center'
        },
    ]

    useEffect(() => {
        getData()
    }, [client])

    const getData = async () => {
        const format = 'YYYY-MM-DD'
        const since = moment().subtract(1, 'year').format(format)
        const until = moment().format(format)
        const data = await getOrdersByClientAndRange({ client, since, until, })
        setData(data)
        origData = JSON.parse(JSON.stringify(data))
        setIsLoading(false)
    }

    const handleFilter = (evt) => {
        const text = evt.target.value || ''
    
        if(!text.length) {
            setData(origData)
            return 
        }


        const filtered = origData.filter( bill => {
                const Pedido = bill.Pedido?.toString()?.includes(text)
                const Producto = bill.Producto?.toString()?.includes(text)
                const CantidadPedida = bill.CantidadPedida?.toString()?.includes(text)
                const CantidadAPreparar = bill.CantidadAPreparar?.toString()?.includes(text)
            return Pedido ||  Producto || CantidadPedida || CantidadAPreparar
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