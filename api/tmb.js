require("dotenv").config();
const fetch = require("node-fetch");

const urlLinies = process.env.URL_API;
const appId = process.env.APP_ID;
const appKey = process.env.APP_KEY;

const getLinies = async () => {
  const response = await fetch(
    `${urlLinies}?app_id=${appId}&app_key=${appKey}`
  );
  if (response) {
    const linies = await response.json();
    return linies;
  } else {
    console.log("Error de connexión");
    return -1;
  }
};

module.exports = {
  getLinies,
};
