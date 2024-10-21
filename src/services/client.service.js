import { toast } from "react-toastify";

const getAuth = () => {
    const auth = JSON.parse(sessionStorage.getItem("currentUser"));
    return auth
}

export async function getClientBills ({ client }) {
    const clientId = client.IdCliente

    try {
        const auth = getAuth()

        const result = await fetch(`${process.env.REACT_APP_BASE_URL}iClientesSP/CuentasCorrientesVendedor?pUsuario=${auth.usuario}&pToken=${auth.Token}&pIdCliente=${clientId}`)
        
        const bills = await result.json()    
        return bills || []
    } catch (error) {
        toast.error('Ocurrio un error al obtener las cuentas del cliente');
        return []
    }
}