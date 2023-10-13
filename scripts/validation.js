import { reactive } from 'vue';
import { rules } from './rules.js';

export const fields = reactive({});

export function invalid (name) {
    return typeof fields[name] === 'string';
}

export function mask (el, binding) {
    const mask = binding.value.mask,
        strippedValue = el.value.replace(/[^0-9]/g, '')
            .split('');
    let count = 0,
        masked = '';

    mask.split('').forEach((character) => {
        character = character.replace(/#/g, '*');

        if (strippedValue[count]) {
            if (/\*/.test(character)) {
                masked += strippedValue[count];
                count++;
            } else {
                masked += character;
            }
        }
    });

    el.value = masked;
    el.dispatchEvent(new Event('input'));
}

export function message (name) {
    return fields[name];
}

function multi (rule, value) {
    return value && value.split('\n').map((line) => 
            line.length && validateRule(rule, line)
        )
        .find((message) => message !== true);
}

export function validate (el, binding) {
    binding.instance.$nextTick(() => {
        const pattern = binding.value?.pattern || binding.value,
            required = pattern.includes('required'),
            value = el.value 
                || el.getAttribute('value') 
                || (el.querySelector('input, select, textarea') && el.querySelector('input, select, textarea').value),
            validation = pattern.match(/[\w-:]+\/.*\/[a-z]*|[\w-:]+/g)
                .sort((x, y) => x == 'required' ? -1 : y == 'required' ? 1 : 0)
                .map((rule) => 
                    (rule.includes('multi')) 
                        ? multi(rule.replace('multi-', ''), value)
                        : validateRule(rule, value)
                )
                .find((message) => message !== true);

        fields[el.getAttribute('name')] = !required && !value || validation;
    });
}

export async function validateAll (scope) {
    let fieldsToValidate = [];

    if (scope) {
        document.querySelectorAll(`[scope="${scope}"]`)
            .forEach((field) => { 
                fieldsToValidate.push(field.getAttribute('name'));
            });
    } else {
        fieldsToValidate = Object.keys(fields);
    }

    await new Promise((resolve) => {
        fieldsToValidate.forEach((field, index, array) => {
            document.getElementsByName(field)[0]
                .dispatchEvent(new Event('input'));

            document.getElementsByName(field)[0]
                .dispatchEvent(new Event('change'));

            if (index === array.length - 1)
                resolve();
        });
    });
    
    return !fieldsToValidate.map((field) => typeof fields[field] === 'string')
        .includes(true);
}

function validateRule (rule, value) {
    return rules[rule.replace(/\:.*/, '')](value, rule.replace(/^(.*?)\:/, ''));
}
