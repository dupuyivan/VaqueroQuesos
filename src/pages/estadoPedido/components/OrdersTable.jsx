import React, { useEffect, useState } from "react"
import moment from "moment/moment"
import CustomTable from "../../../components/customTable"
import { getOrdersByClientAndRange } from "../../../services/orders.service"

export default function OrdersTable ({ client }) {
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
        const format = 'YYYY-MM-DD'
        const since = moment().subtract(1, 'year').format(format)
        const until = moment().format(format)
        const data = await getOrdersByClientAndRange({ client, since, until, })
        setData(data)
        setIsLoading(false)
    }

return (
    <CustomTable 
        columns={columns}
        rows={data}
        isLoading={isLoading}
    />
)}