import { add } from './rules.js';
import { fields, invalid, mask, message, validate, validateAll } from './validation.js';

let maskController = new AbortController(),
    validateController = new AbortController();

export function extend (rule) {
    add(rule);
};

function listenerType (binding, el) {
    return binding.modifiers?.lazy || el?.type === 'select-one' ? 'change' : 'input';
}

export default {
    install: function (app) {
        app.provide('validator', {
            fields: fields,
            invalid: invalid,
            message: message,
            validateAll: validateAll
        });

        app.directive('validate', {
            beforeMount: function (el, binding) {                
                if (binding.value?.pattern || binding.value) {
                    fields[el.getAttribute('name')] = { 
                        lazy: binding.modifiers?.lazy || false, 
                        message: true 
                    };

                    el.addEventListener(listenerType(binding, el), () => validate(el, binding), { signal: validateController.signal });
                }

                if (binding.value?.mask)
                    el.addEventListener('input', (event) => event.data && mask(el, binding), { signal: maskController.signal });
            },
            mounted: function (el, binding) {
                const pattern = binding.value?.pattern || binding.value,
                    selected = el.getElementsByClassName('selected')[0],
                    value = el.classList.contains('select')
                        ? selected && selected.innerText
                        : el.value

                if (binding.arg === 'initial' || (pattern && value))
                    validate(el, binding);
            },
            beforeUpdate: function (el, binding) {
                const newPattern = binding.value?.pattern || binding.value,
                    oldPattern = binding.oldValue?.pattern || binding.oldValue;

                if (oldPattern !== newPattern) {
                    validateController.abort();

                    if (newPattern) {
                        fields[el.getAttribute('name')] = true;
                        validateController = new AbortController();
                        el.addEventListener(listenerType(binding), () => validate(el, binding), { signal: validateController.signal });
                    }
                }

                if (binding.value?.mask !== binding.oldValue?.mask) {
                    maskController.abort();

                    if (binding.value?.mask) {
                        maskController = new AbortController();
                        el.addEventListener('input', (event) => event.data && mask(el, binding), { signal: maskController.signal });
                    }
                }
            },
            updated: function (el, binding) {
                const newPattern = binding.value?.pattern || binding.value,
                    oldPattern = binding.oldValue?.pattern || binding.oldValue;

                if (oldPattern !== newPattern) {
                    const selected = el.getElementsByClassName('selected')[0],
                        value = el.classList.contains('select')
                            ? selected && selected.innerText
                            : el.value

                    if (binding.arg === 'initial' || (newPattern && value))
                        validate(el, binding);
                }
            },
            beforeUnmount: function (el, binding) {
                if (binding.value?.pattern || binding.value) {
                    delete fields[el.getAttribute('name')];
                    validateController.abort();
                }

                if (binding.value?.mask)
                    maskController.abort();
            }
        });
    }
};
