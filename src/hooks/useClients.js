import { useState, useEffect } from "react";

const getMyClientsFromStorage = () => {
    const clientsStr = localStorage.getItem('myClients') 

    if(!clientsStr) return []

    const { clients, day } = JSON.parse(clientsStr)

    const currentDay = new Date().getDate()
    
    if(currentDay !== day) return []

    return clients
}

const saveMyClientsOnStorage = (myClients) => {
    const time = new Date()

    const str = JSON.stringify({
        clients: myClients,
        day: time.getDate()
    })

    localStorage.setItem('myClients', str)
}

export default function useClients () {
    const [clients, setClientes] = useState( getMyClientsFromStorage() );
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if(clients.length) return setIsLoading(false)
        
        const auth = JSON.parse(sessionStorage.getItem("currentUser"));
        pedirListaClientes(auth);
      }, []);

    const pedirListaClientes = async (auth) => {
        try {
          const result = await fetch(
            `${process.env.REACT_APP_BASE_URL}iClientesSP/ClientesDelVendedor?pUsuario=${auth.usuario}&pToken=${auth.Token}&pVendedor=${auth.IdCliente}`
          );
          if (result.status !== 200) {
            throw new Error(result.message);
          }
    
          const json = await result.json();
    
          const clients = json.Clientes.map((cliente) => ({
            ...cliente,
            usuario: cliente.Usuario,
            TipoCliente: "C",
            isVendedor: true,
            vendedor: auth,
          }))

          saveMyClientsOnStorage(clients)
          setClientes(clients);
        } catch (err) {
          console.log(err);
        }
        finally {
            setIsLoading(false)
        }
      };

    return {
        clients,
        isLoading
    }
}