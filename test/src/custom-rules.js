import { extend } from '../../scripts/index';

extend({
    message: 'This field must be a valid MAC address.',
    name: 'mac',
    validate: (value) => /^[0-9a-f]{1,2}([\.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/.test(value) 
});