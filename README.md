# Vue Valid8
A simple form validation package made for Vue.js.

## Installation
`npm install vue-valid8@latest --save`

## Getting Started
```js
import { createApp } from 'vue';
import VueValid8 from 'vue-valid8';

createApp().use(VueValid8);
```

## Usage
Basic setup and usage.
```vue
<template>
    <label>First name:</label>
    <input name="first-name"
        type="text"
        v-validate="'alpha'"
    >
    <span v-if="validator.invalid('first-name')">
        {{ validator.message('first-name') }}
    </span>
</template>

<script>
    export default {
        name: 'Form',
        inject: ['validator']
    }
</script>
```

### Initial Valiadtion
If you want to validate immediately/initially when the user gets to the form, you can do so by setting the argument initial on the directive binding.
```js
v-validate.initial="'alpha'"
```

### Validate All
You are also able to validate all fields before something like a submission and stop it, if a validation fails.
```js
methods: {
    validateForm: function () {
        this.validator.validateAll().then((result) => {
            if (result)
                this.submit();
        });
    }
}
```

### Scope
Scoping your fields will allow you to only validate those fields, if you choose to.
```html
<input name="first-name"
    scope="names"
    v-validate="'alpha'"
>
<span v-if="validator.invalid('first-name')">
    {{ validator.message('first-name') }}
</span>
<input name="last-name"
    scope="names"
    v-validate="'alpha'"
>
<span v-if="validator.invalid('last-name')">
    {{ validator.message('last-name') }}
</span>
```

```js
methods: {
    validateForm: function () {
        this.validator.validateAll('names').then((result) => {
            if (result)
                this.submit();
        });
    }
}
```

## Rules
The package offers some rule already in place you can use without defining your own.

| Name                  | Rule          | Description                                                              |
|-----------------------|---------------|--------------------------------------------------------------------------|
| Alpha                 | alpha         | Only allows alphabetical characters.                                     |
| Alpha Numeric         | alpha-numeric | Only allows alphabetical and numeric characters.                         |
| Alpha Spaces          | alpha-spaces  | Allow alphabetical characters with spaces.                               |
| Domain                | domain        | Has to be a valid domain name.                                           |
| Email                 | email         | Has to be a valid email address.                                         |
| IP Address            | ip            | Has to be a valid IPv4 or IPv6 address.                                  |
| IP Address CIDR Range | ip-cidr       | Any valid IPv4 or IPv6 with a CIDR range.                                |
| Maximum               | max           | Set a character max on an input or textarea.                             |
| Minimum               | min           | Set a character limit on an input or textarea.                           |
| Numeric               | numeric       | Only allows numeric characters.                                          |
| Regular Expression    | regex         | User defined regular expression directly on the directive binding value. |
| Required              | required      | The field is requires input.                                             |
| Telephone             | telephone     | A valid US telephone number.                                             |
| URL                   | url           | Has to be a valid URL.                                                   |

You are able to also chain rules by using the pipe delimter.

**Example**: `'required|alpha'`

If you want to validate any rules (including custom rules) multi-line (with something like a textarea) just add the `multi-` argument at the beginning of a rule.

**Example**: `'multi-alpha'`

### Extending Rules
If you have custom rules that aren't a part of the rules that come with the package, you can extend your own.
```js
import { extend } from 'vue-valid8';

extend({
    message: 'This field must be a valid MAC address.',
    name: 'mac',
    validate: (value) => /^[0-9a-f]{1,2}([\.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/.test(value) 
});
```

### Minimum and Maximum
If there's an input that you want to character limit in any way, use the `min` and `max` rule. The rule below requires the input to have a minimum of 5 characters and a max of 10.
```js
'min:5|max:10'
```

### Custom Regex Rule
If needed you can define your own regex directly on the binding value of the directive, like the rule implies. You can also chain any other rule as well as use the `multi-` argument on your regex as well. The input will also accepts any regular expression flags as well.
```js
'regex:/[a-z]/g'
```

**Note:** Currently you can only add one custom regex rule to the directive at a time.

## Input Masking
Input masking will allow you to format an input. Currently this only works with integers and has to follow a specific format. This works for both `text` inputs and `textarea` as well. You do not have no use any validation while using an input mask, if you choose not to.

### Usage
If you wish to use input masking, you'll start with changing the value of the `v-validate` into an object.
```js
v-validate="{ mask: '(###) ###-####' }"
```

You are also able to use validation along with your mask.
```js
v-validate="{ mask: '(###) ###-####', pattern: 'telephone' }"
```

This will result in both validating the input for telephone, but also masking it and automatically formatting the input for the user. The result of the above example would look something like this.
```text
(123) 123-1234
```

### Multi-line
Multi-line currently is very limited, but can be done.
```js
v-validate="{ mask: '##\n####' }"
```
Each `\n` represents a line break, multi-line can only be used by defining each line's mask. They can follow the same mask or a separate mask.
