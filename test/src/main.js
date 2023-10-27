import App from './App';
import { createApp } from 'vue';
import VueValid8 from '../../scripts/index';
import './custom-rules';

createApp(App)
    .use(VueValid8)
    .mount('#app');
