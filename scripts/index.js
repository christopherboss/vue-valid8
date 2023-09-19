import { add } from './rules.js';
import { fields, invalid, mask, message, validate, validateAll } from './validation.js';

export function extend (rule) {
    add(rule);
};

function listenerType (binding) {
    return binding.modifiers?.lazy ? 'change' : 'input';
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
                    fields[el.getAttribute('name')] = true;
                    el.addEventListener(listenerType(binding), () => validate(el, binding));
                }

                if (binding.value?.mask)
                    el.addEventListener('input', (event) => event.data && mask(el, binding));
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
                    el.removeEventListener(listenerType(binding), () => validate(el, binding));

                    if (newPattern) {
                        fields[el.getAttribute('name')] = true;
                        el.addEventListener(listenerType(binding), () => validate(el, binding));
                    }
                }

                if (binding.value?.mask !== binding.oldValue?.mask) {
                    el.removeEventListener('input', (event) => event.data && mask(el, binding));

                    if (binding.value?.mask)
                        el.addEventListener('input', (event) => event.data && mask(el, binding));
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
                    el.removeEventListener(listenerType(binding), () => validate(el, binding));
                }

                if (binding.value?.mask)
                    el.removeEventListener('input', (event) => event.data && mask(el, binding));
            }
        });
    }
};
