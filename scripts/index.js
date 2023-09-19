import { add } from './rules.js';
import { fields, invalid, mask, message, validate, validateAll } from './validation.js';

let bind = undefined,
    element = undefined;

export function extend (rule) {
    add(rule);
};

function listenerType (binding) {
    return binding.modifiers?.lazy ? 'change' : 'input';
}

function maskListener (event) {
    event.data && mask(element, bind);
}

function setVariables (el, binding) {
    bind = binding;
    element = el;
}

function validateListener () {
    validate(element, bind);
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
                setVariables(el, binding);
                
                if (binding.value?.pattern || binding.value) {
                    fields[el.getAttribute('name')] = true;
                    el.addEventListener(listenerType(binding), validateListener);
                }

                if (binding.value?.mask)
                    el.addEventListener('input', maskListener);
            },
            mounted: function (el, binding) {
                setVariables(el, binding);

                const pattern = binding.value?.pattern || binding.value,
                    selected = el.getElementsByClassName('selected')[0],
                    value = el.classList.contains('select')
                        ? selected && selected.innerText
                        : el.value

                if (binding.arg === 'initial' || (pattern && value))
                    validate(el, binding);
            },
            beforeUpdate: function (el, binding) {
                setVariables(el, binding);

                const newPattern = binding.value?.pattern || binding.value,
                    oldPattern = binding.oldValue?.pattern || binding.oldValue;

                if (oldPattern !== newPattern) {
                    el.removeEventListener(listenerType(binding), validateListener);

                    if (newPattern) {
                        fields[el.getAttribute('name')] = true;
                        el.addEventListener(listenerType(binding), validateListener);
                    }
                }

                if (binding.value?.mask !== binding.oldValue?.mask) {
                    el.removeEventListener('input', maskListener);

                    if (binding.value?.mask)
                        el.addEventListener('input', maskListener);
                }
            },
            updated: function (el, binding) {
                setVariables(el, binding);

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
                setVariables(el, binding);

                if (binding.value?.pattern || binding.value) {
                    delete fields[el.getAttribute('name')];
                    el.removeEventListener(listenerType(binding), validateListener);
                }

                if (binding.value?.mask)
                    el.removeEventListener('input', maskListener);
            }
        });
    }
};
