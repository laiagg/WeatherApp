export const pantalla = {
  template: `
    <div>
      <h1>Clima en {{ selectedCity.name }}</h1>

      <select v-model="selectedCity">
        <option v-for="city in cities" :value="city">{{ city.name }}</option>
      </select>

      <button @click="getWeather">Obtener clima</button>
      <pre v-if="weather">{{ weather }}</pre>
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
    async getWeather(body) {
      try {
        this.error = null;
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
        this.weather = JSON.stringify(data, null, 2);
      } catch (err) {
        this.error = err.message;
        console.error(err);
      }
    }
  },
  mounted() {
    const style = document.createElement('style');
    style.textContent = `
      h1 { color: blue; }
      select, button { margin: 10px 0; padding: 5px 10px; cursor: pointer; }
      pre { background: #f0f0f0; padding: 10px; overflow-x: auto; }
      p.error { color: red; }
    `;
    document.head.appendChild(style);
  }
};
