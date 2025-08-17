export const pantalla = {
  template: `
    <div>
      <h1>Clima en {{ selectedCity.name }}</h1>

      <select v-model="selectedCity">
        <option v-for="city in cities" :value="city">{{ city.name }}</option>
      </select>

      <div v-if="weather" class="weather-box">
        <h2>{{ selectedCity.name }}</h2>
        <img
          :src="'https://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'"
          :alt="weather.weather[0].description"
        />
        <table>
          <tbody>
            <tr>
              <th>Estado</th>
              <td>{{ weather.weather[0].description }}</td>
            </tr>
            <tr>
              <th>Temperatura actual</th>
              <td>{{ weather.main.temp }} °C</td>
            </tr>
            <tr>
              <th>Máxima</th>
              <td>{{ weather.main.temp_max }} °C</td>
            </tr>
            <tr>
              <th>Mínima</th>
              <td>{{ weather.main.temp_min }} °C</td>
            </tr>
            <tr>
              <th>Presión</th>
              <td>{{ weather.main.pressure }} hPa</td>
            </tr>
            <tr>
              <th>Humedad</th>
              <td>{{ weather.main.humidity }} %</td>
            </tr>
            <tr> 
              <th>Visibilidad</th>
              <td>{{ (weather.visibility / 1000).toFixed(1) }} km</td>
            </tr>
            <tr>
              <th>Viento</th>
              <td>{{ weather.wind.speed }} m/s, {{ weather.wind.deg }}°</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="error" v-if="error">{{ error }}</p>
    </div>
  `,
  data() {
    const cities = [
      { name: 'Murcia', lat: 37.9922, lon: -1.1307 },
      { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
      { name: 'Barcelona', lat: 41.3851, lon: 2.1734 }
    ];
    return {
      cities,
      selectedCity: cities[0],
      weather: null,
      error: null
    };
  },
  methods: {
    async getWeather() {
      try {
        this.error = null;
        this.weather = null;
        const { lat, lon } = this.selectedCity;

        const resp = await fetch('http://localhost:3001/weather', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lon })
        });

        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(`Error al obtener el clima: ${txt}`);
        }

        const data = await resp.json();
        this.weather = data;
      } catch (err) {
        this.error = err.message;
        console.error(err);
      }
    }
  },
  watch: {
    selectedCity() {
      this.getWeather();
    }
  },
  mounted() {
    this.getWeather();

    const style = document.createElement('style');
    style.textContent = `
      h1 { color: #1E3A8A; } 
      select { margin: 10px 0; padding: 5px 10px; cursor: pointer; }

      .weather-box { 
        background: #EFF6FF; 
        padding: 15px; 
        margin-top: 15px; 
        border-radius: 8px; 
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        max-width: 400px;
      }

      .weather-box h2 {
        margin: 2px 0 10px 0;
        font-size: 24px;
        text-align: center;
        color: #1E40AF; 
      }

      .weather-box img {
        display: block;
        margin: 10px auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      th, td {
        text-align: left;
        padding: 8px;
        border-bottom: 1px solid #93C5FD;
        font-size: 14px;
      }

      th {
        background-color: #DBEAFE;
        color: #1E40AF;
      }

      p.error { 
        color: red; 
        font-weight: bold; 
        margin-top: 10px;
      }
    `;
    document.head.appendChild(style);
  }
};
