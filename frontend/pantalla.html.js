export const pantallaComponent = {
  template: `
    <div>
      <h1>Clima de Murcia</h1>
      <button @click="getWeather">Obtener clima</button>
      <pre v-if="weather">{{ weather }}</pre>
      <p class="error" v-if="error">{{ error }}</p>
    </div>
  `,
  data() {
    return {
      weather: null,
      error: null
    };
  },
  methods: {
    async getWeather() {
      try {
        this.error = null;
        const resp = await fetch("http://localhost:3000/api/weather"); 
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
  // estilo scoped
  mounted() {
    const style = document.createElement('style');
    style.textContent = `
      h1 { color: blue; }
      button { margin: 10px 0; padding: 5px 10px; cursor: pointer; }
      pre { background: #f0f0f0; padding: 10px; overflow-x: auto; }
      p.error { color: red; }
    `;
    document.head.appendChild(style);
  }
};
