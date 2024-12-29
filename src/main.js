import * as Vue from 'vue'
import App from "./App.vue";
import Knob from "primevue/knob"
import Fieldset from "primevue/fieldset"
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import './assets/main.css'

const app = Vue.createApp(App);
app.config.unwrapInjectedRef = true;
app.component("Knob", Knob);
app.component("Fieldset", Fieldset);
app.mount("#app");