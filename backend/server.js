const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();
const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

async function getWeather(body) {
  const { lat, lon } = body;
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

app.get('/weather', async (req, res) => {
  try {
    const data = await getWeather();
    res.json(data);
    const { lat, lon } = req.body;
  } catch {
    res.status(500).json({ error: 'Error al obtener el clima' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
