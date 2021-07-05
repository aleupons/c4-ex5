require("dotenv").config();
const fetch = require("node-fetch");

const appId = process.env.APP_ID;
const appKey = process.env.APP_KEY;
const urlLinies = `${process.env.URL_API}?app_id=${appId}&app_key=${appKey}`;
const urlEstacions = (codiLinia) =>
  `${process.env.URL_API}${codiLinia}/estacions/?app_id=${appId}&app_key=${appKey}`;

const getLinies = async () => {
  const response = await fetch(urlLinies);
  if (response) {
    const { features: linies } = await response.json();
    return linies;
  } else {
    console.log("Error de connexió");
    process.exit(0);
  }
};

const getEstacions = async (codiLinia) => {
  const response = await fetch(urlEstacions(codiLinia));
  if (response) {
    const { features: estacions } = await response.json();
    return estacions.map((estacio) => estacio);
  } else {
    console.log("Error de connexió");
    process.exit(0);
  }
};

module.exports = {
  getLinies,
  getEstacions,
};
