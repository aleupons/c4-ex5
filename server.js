const express = require("express");
const { getLinies } = require("./api/tmb");

const app = express();
const port = 4000;
const server = app.listen(port, () => {
  console.log("Servidor actiu");
});

server.on("error", (err) => {
  console.log(err.message);
  if (err.code === "EADDRINUSE") {
    console.log("Port ocupat");
  }
});

app.get("/metro/lineas", async (req, res, next) => {
  const { features: liniesApi } = await getLinies();
  const linies = [];
  const linia = {};
  for (const { properties: liniaBuscada } of liniesApi) {
    linia.id = liniaBuscada.CODI_LINIA;
    linia.linea = liniaBuscada.NOM_LINIA;
    linia.descripcion = liniaBuscada.DESC_LINIA;
    linies.push(linia);
  }
  res.send(JSON.stringify(linies));
});

app.get("/metro/linea/", (req, res, next) => {
  res.send({
    linea: "L2",
    descripcion: "Descripción de la línea",
    paradas: [
      {
        id: "x",
        nombre: "Nombre parada",
      },
    ],
  });
});
