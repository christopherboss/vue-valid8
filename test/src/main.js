import { createApp } from 'vue'
import App from './App'

import VueValid8 from '../../scripts/index';

createApp(App)
    .use(VueValid8)
    .mount('#app');
