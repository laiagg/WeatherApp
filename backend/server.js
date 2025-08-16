const express = require('express');
const cors = require('cors'); // <--- importa cors
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();
const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir todas las solicitudes CORS (solo para desarrollo)
app.use(cors());

// Coordenadas de Murcia
const lat = 37.9922;
const lon = -1.1307;

async function getWeather() {
  try {
    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    url.searchParams.set('lat', lat);
    url.searchParams.set('lon', lon);
    url.searchParams.set('appid', OPENWEATHER_KEY);
    url.searchParams.set('units', 'metric');
    url.searchParams.set('lang', 'es');

    const resp = await fetch(url.toString());
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Error OpenWeather: ${txt}`);
    }
    return await resp.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

app.get('/api/weather', async (req, res) => {
  try {
    const data = await getWeather();
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Error al obtener el clima' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
