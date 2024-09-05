import { useState, useEffect } from "react";
import ModoPesar from "./ModoPesar";
import { toast } from "react-toastify";
import { BASE_URL } from "../../BaseURL.json";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const calcularTara = (tara) => {
  let tarasTemp = tara;
  tarasTemp.TaraTotal = 0;
  tarasTemp.Taras.forEach((tara) => {
    tarasTemp.TaraTotal += tara.subTotal;
  });
  return tarasTemp;
};

const ModoPreparar = ({ pedido, salir, onGuardar }) => {
  const [pedidoApreparar, setPedidoApreparar] = useState(pedido);
  const [productoApesar, setProductoApesar] = useState();
  const [prodData, setProdData] = useState({});
  const [taras, setTaras] = useState([]);
  const [pesajesProvisorios, setPesajesProvisorios] = useState([]);
  const [saveDataNew, setSaveDataNew] = useState([]);

  const { push } = useHistory();

  useEffect(() => {
    obtenerPesajesProvisorios();
  }, []);

  useEffect(() => {
    if(!pesajesProvisorios?.ProductosPesados) return

    pedidoApreparar.Productos.forEach((element, index) => {
      let taraFinal = {};

      const pesajeProvisorio = pesajesProvisorios?.ProductosPesados?.find(
        ({ idPedidosProd }) => idPedidosProd === element.idPedidosProd
      );

      if (!pesajeProvisorio) return 

        const tarasProvisorio = taras.map((itemTara) => {

          const elemProvisorio = pesajeProvisorio.Tara.find( ({ IdElemTara, idPedidosProd }) =>
                IdElemTara === itemTara.IdElemTara &&
                element?.idPedidosProd === idPedidosProd
          );

          return {
            ...itemTara,
            cantidad: elemProvisorio?.Cantidad || "",
            Peso: elemProvisorio?.Peso || "",
            subTotal: elemProvisorio?.Cantidad * elemProvisorio?.Peso || ""
          }
        });
        
        element.CantidadAnterior = element.Cantidad

        element.Cantidad = pesajeProvisorio.Cantidad;

        if (prodData.EsPesoFijo) {
          const pesajesProvisoriosFijos = {
            TaraTotal: 0,
            PesoNeto: parseFloat(
              pesajeProvisorio.Cantidad * prodData.PesoPromedio
            ).toFixed(2),
            PesoPorPieza: parseFloat(
              pesajeProvisorio.Cantidad * prodData.PesoPromedio
            ).toFixed(2),
            PesoBruto: pesajeProvisorio.PesoBruto,
            Taras: tarasProvisorio,
            producto: element,
          };

          taraFinal = calcularTara(pesajesProvisoriosFijos);

          taraFinal.TaraTotal !== 0
            ? (taraFinal.PesoBruto = parseFloat(
                taraFinal.producto.Cantidad * prodData.PesoPromedio +
                  taraFinal.TaraTotal
              ).toFixed(2))

            : (taraFinal.PesoBruto = parseFloat(
                taraFinal.producto.Cantidad * prodData.PesoPromedio
              ).toFixed(2));

          taraFinal.PesoNeto = parseFloat(
            taraFinal.PesoBruto - taraFinal.TaraTotal
          ).toFixed(2);

          taraFinal.PesoPorPieza = parseFloat(
            taraFinal.PesoNeto / pesajesProvisoriosFijos.producto.Cantidad
          ).toFixed(2);

        } else {

          const pesajesProvisoriosFijos = {
            TaraTotal: 0,
            PesoNeto: 0,
            PesoPorPieza: 0,
            PesoBruto: pesajeProvisorio.PesoBruto,
            Taras: tarasProvisorio,
            producto: element,
          };

          taraFinal = calcularTara(pesajesProvisoriosFijos);

          if (taraFinal.PesoBruto !== 0) {

            taraFinal.PesoNeto = parseFloat(
              taraFinal.PesoBruto - taraFinal.TaraTotal
            ).toFixed(2);

            taraFinal.PesoPorPieza = parseFloat(
              taraFinal.PesoNeto / pesajesProvisoriosFijos.producto.Cantidad
            ).toFixed(2);

          }

        }

        const { producto, PesoBruto, Taras, PesoPorPieza, PesoNeto } = taraFinal;

        let ProductoPesado = pedidoApreparar.Productos;

        if (ProductoPesado[index].idPedidosProd === element.idPedidosProd) {

          ProductoPesado[index].Pesaje = {
            PesoBruto,
            Taras,
            PesoPorPieza,
            PesoNeto,
          };

          if ( ProductoPesado[index].CantidadAnterior <= ProductoPesado[index].Cantidad ) {
            ProductoPesado[index].NuevoPedido = false;
            ProductoPesado[index].DesecharFaltante = false;
          }

          setPedidoApreparar({ ...pedidoApreparar, Productos: ProductoPesado });
        }

    });
    //eslint-disable-next-line
  }, [pesajesProvisorios, taras, prodData]);

  const obtenerPedidos = async (prod) => {
    try {
      const auth = JSON.parse(sessionStorage.getItem("auth"));
      const result = await fetch(
        `${BASE_URL}iProductosSP/ProductosDatos?pUsuario=${auth.usuario}&pToken=${auth.Token}`
      );

      if (result.status !== 200) {
        if (result.status === 401) return push("/");
        throw new Error("error al obtener los pedidos");
      }

      const json = await result.json();
      setProdData(() => json.find(({ Codigo }) => prod.Codigo === Codigo));
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  const obtenerPesajesProvisorios = async () => {
    try {
      const auth = JSON.parse(sessionStorage.getItem("auth"));
      const result = await fetch(
        `${BASE_URL}iPedidosSP/datosPesosProvisorios?pUsuario=${auth.usuario}&pToken=${auth.Token}`
      );
      if (result.status !== 200) {
        if (result.status === 401) return push("/");
        throw new Error("Error al obtener pesajes provisorios");
      }

      await pedirTaras();

      const json = await result.json();
      setPesajesProvisorios(json);
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  const handlePesajeProvisorio = async (obj) => {
    const auth = JSON.parse(sessionStorage.getItem("auth"));

    try {
      const result = await fetch(
        `${BASE_URL}iPedidosSP/PrepararProvisorioGuardar?pUsuario=${auth.usuario}&pToken=${auth.Token}&pIdClienteRegistro=${pedido.IdCliente}`,
        {
          method: "POST",
          body: JSON.stringify(obj),
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (result.status === 401) return push("/");

        if(result.ok) toast.success('Pesaje guardado exitosamente');
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  /* Manejadores de eventos */
  const handlePesar = async (productId) => {
    const product = pedido.Productos.find( product => product.idPedidosProd === productId )

    await obtenerPesajesProvisorios()
    await obtenerPedidos(product);
    setProductoApesar(product);
  };

  const handleGuardarPesaje = (pesaje, units, product) => {
    const productIdx = pedidoApreparar.Productos.findIndex( product_ => product_.idPedidosProd === product.idPedidosProd)

    const products = pedidoApreparar.Productos

    products[productIdx].Pesaje = {
      PesoBruto: pesaje.PesoBruto,
      Taras: pesaje.Taras,
      PesoPorPieza: pesaje.PesoPorPieza,
      PesoNeto: pesaje.PesoNeto
    }

    products[productIdx].CantidadAnterior = product.Cantidad

    products[productIdx].Cantidad = units
    
    if ( products[productIdx].CantidadAnterior <= products[productIdx].Cantidad ) {
      products[productIdx].NuevoPedido = false;
      products[productIdx].DesecharFaltante = false;
    }

    // no se que hace
    /*  const cloneSaveData = [...saveDataNew];

      cloneSaveData[productIdx] = true;

      setSaveDataNew(cloneSaveData); 
    */
      // FIN no se que hace

    pedidoApreparar.Productos = products

    setPedidoApreparar(pedidoApreparar)

    const saveProvisoriPesaje = {
      idPedidosProd: products[productIdx].idPedidosProd,
      idMedidaPrinc: products[productIdx].idMedidaPrinc,
      Cantidad: products[productIdx].Cantidad,
      PesoBruto: products[productIdx].Pesaje.PesoBruto,
      Tara: products[productIdx].Pesaje.Taras.map((tara) => ({
        $id: tara.$id,
        idPedidosProd: tara.idPedidosProd,
        IdElemTara: tara.IdElemTara,
        Cantidad: tara.cantidad,
        Peso: tara.Peso,
      }))
    }

    handlePesajeProvisorio(saveProvisoriPesaje);
    setProductoApesar(undefined);

  };

  const handleEliminarPesaje = (index) => (e) => {
    let ProductoPesado = pedidoApreparar.Productos;

    if(!ProductoPesado[index].Pesaje) return

    ProductoPesado[index].Pesaje = undefined;

    ProductoPesado[index].Cantidad = ProductoPesado[index].CantidadAnterior;

    /* const cloneSaveData = [...saveDataNew];

    cloneSaveData[index] = false;

    setSaveDataNew(cloneSaveData); */

    setPedidoApreparar({
      ...pedidoApreparar,
      Productos: ProductoPesado,
    });

  };

  const handleDescartarNuevoClick = (tipo, indexProd) => (e) => {
    const pedidoTemp = pedidoApreparar;

    const Tipos = {
      Descartar: () => {
        pedidoTemp.Productos[indexProd].DesecharFaltante = true;
        pedidoTemp.Productos[indexProd].NuevoPedido = false;
      },
      Nuevo: () => {
        pedidoTemp.Productos[indexProd].NuevoPedido = true;
        pedidoTemp.Productos[indexProd].DesecharFaltante = false;
      },
    };

    Tipos[tipo]();

    setPedidoApreparar({ ...pedidoTemp });

    // no se que hace
    /* const cloneSaveData = [...saveDataNew];

    cloneSaveData[indexProd] = true;

    setSaveDataNew(cloneSaveData); */
  };

  const handleCancelarPesaje = (e) => {
    // no se que hace
    /* const cloneSaveData = [...saveDataNew];
    cloneSaveData[productoApesar.index] = false;
    setSaveDataNew(cloneSaveData); */

    setProductoApesar(null);
  };

  const pedirTaras = async () => {
    const user = JSON.parse(sessionStorage.getItem("auth")) || {};
    let tarasTemp = [];
    try {
      const result = await fetch(
        `${BASE_URL}iElemTaraSP/ElementosTaraDatos?pUsuario=${user.usuario}&pToken=${user.Token}`
      );
      if (result.status !== 200) {
        throw new Error(result.text);
      }
      const json = await result.json();
      json.forEach((tara) =>
        tarasTemp.push({
          ...tara,
          subTotal: 0,
          cantidad: 0,
          PesoEditable: !tara.Peso,
        })
      );
      setTaras(tarasTemp);
    } catch (err) {
      console.log(err);
    }
  };

  const validateButtonSave = () => {

    const allProducsMeetsConditions = pedidoApreparar.Productos.every( product => {
      return product?.Pesaje || product?.DesecharFaltante || product?.NuevoPedido
    })

    return !allProducsMeetsConditions
  };

 const handleOnGuargar = (e) => {
  e.preventDefault();
  onGuardar(pedidoApreparar)
 }

  return !productoApesar ? (    
    <div className="contenedor-tabla">      
      <div className="contenedor-cliente">

        <div className="datos">
          <span>Cliente: {pedidoApreparar.Cliente}</span>

          <span>Pedido: {pedidoApreparar.Pedido}</span>

          <span>Fecha: {pedidoApreparar.Fecha}</span>

          <span>Observacion:</span>
          <textarea 
            value={pedidoApreparar?.Observacion || ''} 
            readOnly disabled 
            wrap="hard" 
            style={{ width: '100%', height:"5rem", resize: "none", border: "none", fontSize: 18, color:'red' }}
          />
      
        </div>
       
        <div className="botones" style={{ justifySelf:"end", alignSelf:"end" }}>
          <button
            onClick={salir}
            className="fas fa-window-close btn btn-red"
          >
          </button>
          <button
            type="submit"
            onClick={handleOnGuargar}
            className="btn"
            disabled={validateButtonSave()}
          >
            Enviar a facturacion
          </button>
        </div>
      </div>

      <table className="tabla tabla-pedidos tabla-preparar">
        <thead>
          <tr>
            <th>CÓDIGO</th>
            <th>PRESENTACION</th>
            <th>CANTIDAD</th>
            <th>PESO</th>
            <th>PESO POR PIEZA</th>
          </tr>
        </thead>
        <tbody>
          {pedidoApreparar.Productos?.map(
            (
              {
                Codigo,
                Presentacion,
                Cantidad,
                Medida,
                Pesaje,
                pesoMaximo,
                pesoMinimo,
                NuevoPedido,
                DesecharFaltante,
                CantidadAnterior,
                idPedidosProd
              },
              indexProd
            ) => (
              <tr key={indexProd}>
                <td>{Codigo}</td>
                <td>
                  <span className="titulo">{Presentacion}</span>
                  <div style={{ display: "flex" }}>
                    <div
                      hidden={
                        !(  
                          Pesaje === undefined ||
                          CantidadAnterior === null ||
                          CantidadAnterior > Cantidad
                        )
                      }
                    >
                      <button
                        title="Presione para cargar el faltante a un nuevo pedido"
                        onClick={handleDescartarNuevoClick("Nuevo", indexProd)}
                        className={`boton nuevo ${
                          NuevoPedido ? "seleccionado" : ""
                        }`}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                      <button
                        title="Presione para desechar el faltante"
                        onClick={handleDescartarNuevoClick(
                          "Descartar",
                          indexProd
                        )}
                        className={`boton eliminar ${
                          DesecharFaltante ? "seleccionado" : ""
                        }`}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    
                    <button
                        onClick={() => handlePesar(idPedidosProd) }
                        className="boton pesaje"
                      >
                        Pesar
                      </button>

                      <button
                        className="boton pesaje"
                        onClick={handleEliminarPesaje(indexProd)}
                      >
                        Eliminar pesaje
                      </button>
                  </div>
                </td>
                <td>{`${Cantidad} ${Medida}`}</td>
                <td>{`${Pesaje?.PesoNeto || 0}`}</td>
                <td
                  className={`${
                    Pesaje?.PesoPorPieza > 0 &&
                    (Pesaje?.PesoPorPieza < pesoMinimo ||
                      Pesaje?.PesoPorPieza > pesoMaximo)
                      ? "pesoRojo"
                      : ""
                  }`}
                >{`${Pesaje?.PesoPorPieza || 0}`}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <hr />
      <div
        style={{
          width: "80%",
        }}
      >
        <textarea
          rows="4"
          cols="50"
          onChange={(e) =>
            setPedidoApreparar({
              ...pedidoApreparar,
              ObservacionFact: e.target.value,
            })
          }
          value={pedidoApreparar?.ObservacionFact || ""}
          style={{ width:'100%', borderColor: 'gray', borderRadius: '8px', padding: ".5rem", resize: 'none'  }}
          placeholder="Deja tu comentario.."
        />
      </div>
    </div>
  ) : (
    <ModoPesar
      producto={productoApesar}
      pesajeProvisorio={pesajesProvisorios.ProductosPesados.find(
        ({ idPedidosProd }) => productoApesar.idPedidosProd === idPedidosProd
      )}
      onGuardar={handleGuardarPesaje}
      onCancelar={handleCancelarPesaje}
      prodData={prodData}
      pedirData={obtenerPedidos}
    />
  );
};

export default ModoPreparar;
