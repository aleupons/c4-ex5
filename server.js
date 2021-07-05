const express = require("express");
const morgan = require("morgan");
const { getLinies, getEstacions } = require("./api/tmb");

const app = express();
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Servidor actiu al port ${port}`);
});

server.on("error", (err) => {
  console.log(err.message);
  if (err.code === "EADDRINUSE") {
    console.log(`El port ${port} està ocupat`);
  }
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());

app.get("/metro/lineas", async (req, res, next) => {
  try {
    const liniesApi = await getLinies();
    const linies = liniesApi.map(({ properties: liniaBuscada }) => ({
      id: liniaBuscada.CODI_LINIA,
      linea: liniaBuscada.NOM_LINIA,
      descripcion: liniaBuscada.DESC_LINIA,
    }));
    res.json(linies);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      error.message = "Error al connectar amb TMB";
    }
    res.status(500).json({ error: true, misatge: error.message });
  }
});

app.get("/metro/linea/:linia/", async (req, res, next) => {
  try {
    const liniesApi = await getLinies();
    const { properties: liniaTrobada } = liniesApi.find(
      (liniaBuscada) =>
        liniaBuscada.properties.NOM_LINIA.toLowerCase() ===
        req.params.linia.toLowerCase()
    );
    if (liniaTrobada === undefined) {
      throw new Error("Aquesta línia no existeix");
    }
    const estacionsApi = await getEstacions(liniaTrobada.CODI_LINIA);
    const linia = {
      linea: liniaTrobada.NOM_LINIA,
      descripcion: liniaTrobada.DESC_LINIA,
      paradas: estacionsApi.map((estacioBuscada) => ({
        id: estacioBuscada.properties.CODI_ESTACIO_LINIA,
        nombre: estacioBuscada.properties.NOM_ESTACIO,
      })),
    };
    res.json(linia);
  } catch (error) {
    console.log(error);
    if (error.code === "ECONNREFUSED") {
      error.message = "Error al connectar amb TMB";
    }
    res.status(500).json({ error: true, missatge: error.message });
  }
});

app.put("*", (req, res, next) => {
  res
    .status(403)
    .json({ error: true, mensaje: "Te pensabas que podías jaquearme" });
});

app.post("*", (req, res, next) => {
  res
    .status(403)
    .json({ error: true, mensaje: "Te pensabas que podías jaquearme" });
});

app.delete("*", (req, res, next) => {
  res
    .status(403)
    .json({ error: true, mensaje: "Te pensabas que podías jaquearme" });
});

app.use((req, res, next) => {
  res.status(404).json({ error: true, missatge: "Aquesta pàgina no existeix" });
});

app.use((err, req, res, next) => {
  const codi = err.codi || 500;
  const missatge = err.codi
    ? err.message
    : { error: true, missatge: "Error general" };
  res.status(codi).send(missatge);
});
