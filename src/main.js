import { createApp } from 'vue'
import App from './App.vue'

import Oruga from '@oruga-ui/oruga-next'
import '@oruga-ui/oruga-next/dist/oruga-full-vars.css'
import '@mdi/font/css/materialdesignicons.min.css'

createApp(App)
    .use(Oruga)
    .mount('#app')
