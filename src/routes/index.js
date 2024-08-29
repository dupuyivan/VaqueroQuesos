import { createBrowserRouter } from "react-router-dom";
import { Login, Carrito, Lista, Dashboard } from "./pages";
/* import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { GetPedidosProvider } from "./context/GetPedidos"; */

export const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello world!</div>,
    },
]);
