import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import Oruga from '@oruga-ui/oruga-next'
import '@oruga-ui/oruga-next/dist/oruga-full-vars.css'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas, fab);
const pinia = createPinia()

createApp(App)
  .component("VueFontawesome", FontAwesomeIcon)
  .use(Oruga, {
    iconPack: 'fas',
    iconComponent: 'vue-fontawesome'
  })
  .use(pinia)
  .mount("#app");
