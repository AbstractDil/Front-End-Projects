import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import store from './store';  // <-- Import the Vuex store
import Swal from 'sweetalert2';  // <-- Import Swal here
import "./axios";

const app = createApp(App);

// Make Swal globally accessible
app.config.globalProperties.$swal = Swal;

app.use(store);  // <-- Register the Vuex store
app.use(router);

app.mount('#app');
