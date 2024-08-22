import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { BASE_URL } from "../../BaseURL.json";

const calcularTara = (tara) => {
  let tarasTemp = tara;
  tarasTemp.TaraTotal = 0;
  tarasTemp.Taras.forEach((tara) => {
    tarasTemp.TaraTotal += tara.subTotal;
  });

  return tarasTemp;
};

const ModoPesar = ({
  producto,
  onGuardar,
  onCancelar,
  pedirData,
  pesajeProvisorio,
}) => {
  const [prodData, setProdData] = useState({});
  const [pesaje, setPesaje] = useState({
    TaraTotal: 0,
    PesoNeto: 0,
    PesoPorPieza: 0,
    PesoBruto: 0,
    Taras: null,
    producto: producto,
  });
  const [taras, setTaras] = useState([]);
  const [editPiezas, setEditPiezas] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { push } = useHistory();

  /* Manejadores de eventos */
  const handleChangeBruto = (e) => {
    const onlyNumber = /[A-Z]/gi;
    const onlyComma = /,/g;

    const { value } = e.target;
    const valueWithoutLetters = value.replace(onlyNumber, "");
    const valueWithDot = valueWithoutLetters.replace(onlyComma, ".");

    calcular({ ...pesaje, PesoBruto: parseFloat(valueWithDot) });
  };

  const handlePiezasClick = () => {
    if (!pesaje.producto.Cantidad) return;

    setEditPiezas((prev) => !prev);
  };

  const handleChangePiezas = (e) => {
    const soloNumeros = /([A-Z])/gi;
    const soloComa = /,/gi;

    const { value } = e.target;
    const valorReemplazado = value
      .replace(soloNumeros, "")
      .replace(soloComa, ".");
    e.target.value = valorReemplazado;

    const tempProd = {
      ...pesaje.producto,
      Cantidad: parseFloat(valorReemplazado),
    };

    calcular({ ...pesaje, producto: tempProd });
  };

  const handleChangePeso = (e, indice) => {
    const esNumero = /^[0-9]+([.])?([0-9]+)?$/;
    let taraTemp = pesaje.Taras;
    if (!e.target.value.trim().match(esNumero)) {
      e.target.value = "<br/>";
      taraTemp[indice].Peso = 0;
      taraTemp[indice].subTotal = 0;
      calcular({ ...pesaje, Taras: taraTemp });
      return;
    }
    taraTemp[indice].subTotal =
      parseFloat(e.target.value) * parseFloat(taraTemp[indice].cantidad);
    taraTemp[indice].Peso = parseFloat(e.target.value);

    calcular({
      ...pesaje,
      Taras: taraTemp,
    });
  };

  const handleChange = (indice, e) => {
    const esNumero = /^[0-9]+([.])?([0-9]+)?$/;
    let taraTemp = pesaje.Taras;

    if (!e.target.value.trim().match(esNumero)) {
      e.target.innerHTML = " ";
      taraTemp[indice].subTotal = 0;
      taraTemp[indice].cantidad = 0;
      calcular({ ...pesaje, Taras: taraTemp });
      return;
    }
    taraTemp[indice].subTotal =
      parseFloat(e.target.value) * parseFloat(taraTemp[indice].Peso);
    taraTemp[indice].cantidad = parseFloat(e.target.value);

    calcular({
      ...pesaje,
      Taras: taraTemp,
    });
  };

  /* funciones  */
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
      console.error(err);
    }
  };

  const calcular = (taraTemp) => {
    const taraFinal = calcularTara(taraTemp);

    if (prodData.EsPesoFijo) {
      const pesoBruto =
        taraFinal.TaraTotal !== 0
          ? (
              taraFinal.producto.Cantidad * prodData.PesoPromedio +
              taraFinal.TaraTotal
            ).toFixed(2)
          : (taraFinal.producto.Cantidad * prodData.PesoPromedio).toFixed(2);

      const pesoNeto = (pesoBruto - taraFinal.TaraTotal).toFixed(2);
      const pesoPorPieza = (pesoNeto / taraTemp.producto.Cantidad).toFixed(2);

      setPesaje({
        ...taraFinal,
        Cantidad: parseFloat(taraTemp?.producto.Cantidad),
        PesoBruto: parseFloat(pesoBruto),
        PesoNeto: parseFloat(pesoNeto),
        PesoPorPieza: parseFloat(pesoPorPieza),
      });
      return;
    }

    if (taraFinal.PesoBruto !== 0) {
      const pesoNeto = (taraFinal.PesoBruto - taraFinal.TaraTotal).toFixed(2);
      const pesoPorPieza = (pesoNeto / taraTemp.producto.Cantidad).toFixed(2);

      setPesaje({
        ...taraFinal,
        Cantidad: parseFloat(taraTemp?.producto.Cantidad),
        PesoNeto: parseFloat(pesoNeto),
        PesoPorPieza: parseFloat(pesoPorPieza),
      });
      return;
    }
  };

  useEffect(() => {
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
        await pedirTaras();
        setProdData(() => json.find(({ Codigo }) => prod.Codigo === Codigo));
      } catch (err) {
        console.error(err);
        toast.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    obtenerPedidos(producto);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    try {
      if (pesajeProvisorio) {
        const tarasProvisorio = taras.map((itemTara) => {
          const elemProvisorio = pesajeProvisorio.Tara.find(
            ({ IdElemTara }) => IdElemTara === itemTara.IdElemTara
          );
          itemTara.cantidad = elemProvisorio.Cantidad;
          itemTara.Peso = elemProvisorio.Peso;
          itemTara.subTotal = elemProvisorio.Cantidad * elemProvisorio.Peso;
          return itemTara;
        });
        const productoCantidad = pesajeProvisorio.Cantidad;
        const pesoBruto = pesajeProvisorio.PesoBruto;
        const pesajesProvisoriosFijos = {
          TaraTotal: 0,
          PesoBruto: pesoBruto,
          Taras: tarasProvisorio,
          producto: {
            ...producto,
            Cantidad: productoCantidad,
          },
        };
        const taraFinal = calcularTara(pesajesProvisoriosFijos);
        if (prodData.EsPesoFijo) {
          const pesoPromedio = prodData.PesoPromedio;
          const pesoNeto = productoCantidad * pesoPromedio;
          taraFinal.PesoBruto = (pesoNeto + taraFinal.TaraTotal).toFixed(2);
          taraFinal.PesoNeto = (
            taraFinal.PesoBruto - taraFinal.TaraTotal
          ).toFixed(2);
          taraFinal.PesoPorPieza = (
            taraFinal.PesoNeto / productoCantidad
          ).toFixed(2);
        } else {
          if (taraFinal.PesoBruto !== 0) {
            taraFinal.PesoNeto = (
              taraFinal.PesoBruto - taraFinal.TaraTotal
            ).toFixed(2);
            taraFinal.PesoPorPieza = (
              taraFinal.PesoNeto / productoCantidad
            ).toFixed(2);
          }
        }
        setPesaje(taraFinal);
      } else {
        const taraTotal = 0;
        const tarasCopy = [...taras];

        const productoCantidad = producto.Cantidad;
        if (prodData.EsPesoFijo) {
          console.log("EsPesoFijo", prodData.EsPesoFijo);
          const pesoPromedio = prodData.PesoPromedio;
          const pesoNeto = productoCantidad * pesoPromedio;
          setPesaje({
            TaraTotal: taraTotal,
            PesoBruto: pesoNeto.toFixed(2),
            PesoNeto: pesoNeto.toFixed(2),
            PesoPorPieza: pesoNeto.toFixed(2),
            Taras: tarasCopy,
            producto: {
              ...producto,
              Cantidad: productoCantidad,
            },
          });
        } else {
          setPesaje({
            TaraTotal: taraTotal,
            PesoBruto: "0",
            PesoNeto: "0",
            PesoPorPieza: "0",
            Taras: tarasCopy,
            producto: {
              ...producto,
              Cantidad: productoCantidad,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  }, [prodData, pesajeProvisorio, producto]);

  if (isLoading) return <div className="spin" />;
  return (
    <div className="contenedor-tabla">
      <div className="contenedor-cliente">
        <div className="datos">
          <span>Codigo: {pesaje.producto.Codigo}</span>
          <span>Presentacion: {pesaje.producto.Presentacion}</span>
        </div>
      </div>
      <div className="form-tabla">
        <div className="form-pesaje">
          <div className="flex-input piezas-input">
            <label htmlFor="piezas">Piezas Totales</label>
            <div className="piezas-input-boton">
              <input
                formnovalidate
                min={0}
                type="text"
                name="piezas"
                id="piezas"
                disabled={!editPiezas}
                value={
                  isNaN(pesaje?.producto?.Cantidad)
                    ? " "
                    : pesaje?.producto?.Cantidad
                }
                onChange={handleChangePiezas}
              />
              <button onClick={handlePiezasClick}>
                {!editPiezas ? "Cambiar" : "Cambiando"}
              </button>
            </div>
          </div>
          <div className="flex-input bruto-input">
            <label htmlFor="bruto">Peso Bruto</label>
            <input
              formnovalidate
              type="text"
              name="bruto"
              id="bruto"
              step={0.5}
              inputMode="decimal"
              onChange={handleChangeBruto}
              disabled={prodData.EsPesoFijo ? true : false}
              value={prodData.EsPesoFijo ? pesaje.PesoBruto : null}
              placeholder={
                pesajeProvisorio
                  ? "Provisorio: " + pesajeProvisorio.PesoBruto
                  : null
              }
              // value={JSON.parse(pesaje.PesoBruto)}
            />
          </div>
          <div className="flex-input ">
            <div className="tara-input">
              <label htmlFor="tara">Tara</label>
              <input
                formnovalidate
                type="text"
                name="tara"
                id="tara"
                disabled
                value={
                  isNaN(pesaje.TaraTotal)
                    ? " "
                    : parseFloat(pesaje.TaraTotal).toFixed(2)
                }
              />
            </div>
          </div>
          <div className="flex-input neto-input">
            <label htmlFor="neto">Peso Neto</label>
            <input
              formnovalidate
              disabled
              type="text"
              name="neto"
              id="neto"
              value={isNaN(pesaje.PesoNeto) ? " " : pesaje.PesoNeto}
            />
          </div>
          <div className="flex-input pesoPieza-input">
            <label htmlFor="pesoPieza">Peso por Pieza</label>
            <input
              formnovalidate
              disabled
              type="text"
              name="pesoPieza"
              id="pesoPieza"
              className={`${
                pesaje.PesoPorPieza > 0 &&
                (pesaje.PesoPorPieza < producto.pesoMinimo ||
                  pesaje.PesoPorPieza > producto.pesoMaximo)
                  ? "pesoRojo"
                  : ""
              }`}
              value={isNaN(pesaje.PesoPorPieza) ? " " : pesaje.PesoPorPieza}
            />
          </div>

          <div className="botones-form">
            <button onClick={onCancelar} className="boton-form boton-cancelar">
              Cancelar
            </button>
            <button
              disabled={!(pesaje.PesoPorPieza > 0)}
              onClick={onGuardar(pesaje)}
              className="boton-form"
            >
              Guardar
            </button>
          </div>
        </div>
        <div className="tara-table">
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Peso</th>
                <th>SubTotal</th>
              </tr>
            </thead>
            <tbody>
              {pesaje.Taras?.map((tara, index) => (
                <tr key={index}>
                  <td>{tara.Descripcion}</td>
                  <td className="modo-pesar-input">
                    <input
                     type="number" 
                      name="cantidad"
                      value={tara.cantidad || ""}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </td>
                  <td className="modo-pesar-input">
                    <input
                     type="number" 
                      name="peso"
                      value={tara.Peso || ""}
                      onChange={(e) => handleChangePeso(e, index)}
                      disabled={!tara.EditaPeso}
                    />
                  </td>
                  <td>{parseFloat(tara.subTotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModoPesar;
