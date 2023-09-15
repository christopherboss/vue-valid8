import { createApp } from 'vue'
import App from './App'

import VueValid from '../../scripts/index';

createApp(App)
    .use(VueValid)
    .mount('#app');
