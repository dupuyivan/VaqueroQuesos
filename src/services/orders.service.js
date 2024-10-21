import { toast } from "react-toastify";

const getAuth = () => {
    const auth = JSON.parse(sessionStorage.getItem("currentUser"));
    return auth
}

export async function getOrdersByClientAndRange ({ client, since, until }) {
    const clientId = client.IdCliente
    let orders = []

    console.debug('getOrdersByClientAndRange', { client, since, until })

    try {
        const auth = getAuth()
        const result = await fetch(`${process.env.REACT_APP_BASE_URL}iPedidosSP/PedidosPorEstadoCliente?pUsuario=${auth.usuario}&pToken=${auth.Token}&pFechaDesde=${since}&pFechaHasta=${until}&pIdCliente=${clientId}`)        
        
        const res = await result.json()

        orders = res
    } catch (error) {
        toast.error('Ocurrio un error al obtener las cuentas del cliente');
    }
    finally {
        return orders
    }
}