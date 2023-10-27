<template>
    <h2>HTML Inputs</h2>
    <div class="row">
        <label>Name: </label>
        <input name="name"
            scope="1"
            type="text"
            v-model="name"
            v-validate="String.raw`required|regex:/^[a-zA-Z0-9-_.'/ ]+$/`"
        >
        <span class="invalid"
            v-if="validator.invalid('name')"
        >
            {{ validator.message('name') }}
        </span>
    </div>
    <div class="row">
        <label>Email: </label>
        <input name="email"
            scope="2"
            type="text"
            v-model="email.value"
            v-validate="email.validation"
        >
        <span class="invalid"
            v-if="validator.invalid('email')"
        >
            {{ validator.message('email') }}
        </span>
    </div>
    <div class="row">
        <label>MAC Address: </label>
        <input name="mac-address"
            scope="2"
            type="text"
            v-model="macAddress"
            v-validate="'mac|required'"
        >
        <span class="invalid"
            v-if="validator.invalid('mac-address')"
        >
            {{ validator.message('mac-address') }}
        </span>
    </div>
    <div class="row">
        <label>Domain: </label>
        <input name="domain"
            scope="2"
            type="text"
            v-model="domain"
            v-validate="'domain|required'"
        >
        <span class="invalid"
            v-if="validator.invalid('domain')"
        >
            {{ validator.message('domain') }}
        </span>
    </div>
    <div class="row">
        <label>State: </label>
        <select name="state"
            scope="street-number"
            v-model="state"
            v-on:change="$event.isTrusted && test()"
            v-validate="''"
        >
            <option>NJ</option>
            <option>NY</option>
            <option>PA</option>
        </select>
        <span class="invalid"
            v-if="validator.invalid('state')"
        >
            {{ validator.message('state') }}
        </span>
    </div>
    <div class="row">
        <label>Notes: </label>
        <textarea name="notes"
            v-model="notes"
            v-validate="'required|alpha'"
        ></textarea>
        <span class="invalid"
            v-if="validator.invalid('notes')"
        >
            {{ validator.message('notes') }}
        </span>
    </div>
    <h2>Custom Components</h2>
    <div class="row">
        <label>Favorite Color: </label>
        <select-menu name="color"
            :options="color.options"
            scope="street-number"
            v-model="color.value"
            v-on:change="test()"
            v-validate="'required'"
        >
        </select-menu>
        <span class="invalid"
            v-if="validator.invalid('color')"
        >
            {{ validator.message('color') }}
        </span>
    </div>
    <div class="row">
        <label>Summary: </label>
        <text-area name="summary"
            v-model="summary"
            v-validate="'max:5|min:5'"
        ></text-area>
        <span class="invalid"
            v-if="validator.invalid('summary')"
        >
            {{ validator.message('summary') }}
        </span>
    </div>
    <h2>Custom Regex</h2>
    <div class="row">
        <label>Age: </label>
        <input name="age"
            type="text"
            v-model="age"
            v-validate="String.raw`required|regex:/^(0|[1-9][0-9]*)$/`"
        >
        <span class="invalid"
            v-if="validator.invalid('age')"
        >
            {{ validator.message('age') }}
        </span>
    </div>
    <div class="row">
        <label>List of Ages: </label>
        <textarea name="ages"
            v-model="ages"
            v-validate="'required|multi-regex:/^(0|[1-9][0-9]*)$/'"
        ></textarea>
        <span class="invalid"
            v-if="validator.invalid('ages')"
        >
            {{ validator.message('ages') }}
        </span>
    </div>
    <h2>Lazy</h2>
    <div class="row">
        <label>Street Number: </label>
        <input name="street-number"
            scope="street-number"
            type="text"
            v-model="streetNumber"
            v-validate.lazy="'required|numeric'"
        >
        <span class="invalid"
            v-if="validator.invalid('street-number')"
        >
            {{ validator.message('street-number') }}
        </span>
        <br />
        <button v-on:click="submit()">Submit</button>
    </div>
    <h2>Masking</h2>
    <div class="row">
        <label>Phone Number: </label>
        <input name="phone-number"
            type="text"
            v-model="phoneNumber"
            v-validate="{ mask: mask }"
        >
        <span class="invalid"
            v-if="validator.invalid('phone-number')"
        >
            {{ validator.message('phone-number') }}
        </span>
    </div>
    <separate-template></separate-template>
    <slot-template>
        <template v-slot:content>
            <label>Title: </label>
            <input name="title"
                type="text"
                v-model="dialogs.add.topic.title"
                v-validate="'min:3|required'"
            >
            <span class="invalid"
                v-if="validator.invalid('title')"
            >
                {{ validator.message('title') }}
            </span>
        </template>
    </slot-template>
</template>

<script>
    import SelectMenu from './components/SelectMenu';
    import SeparateTemplate from './components/SeparateTemplate';
    import SlotTemplate from './components/SlotTemplate';
    import TextArea from './components/TextArea';

    export default {
        name: 'App',
        inject: ['validator'],
        components: {
            SelectMenu,
            SeparateTemplate,
            SlotTemplate,
            TextArea
        },
        data: function () {
            return {
                age: '',
                ages: '',
                color: {
                    options: [
                        {
                            label: 'Blue',
                        },
                        {
                            label: 'Green',
                        },
                        {
                            label: 'Red',
                        },
                    ],
                    value: '',
                },
                dialogs: {
                    add: {
                        topic: {
                            title: ''
                        }
                    }
                },
                domain: '',
                email: {
                    validation: 'email|required',
                    value: ''
                },
                macAddress: '',
                mask: '##:##:##:##:##:##',
                name: '',
                notes: '',
                phoneNumber: '',
                state: '',
                streetNumber: '',
                summary: ''
            };
        },
        methods: {
            submit: function () {
                this.validator.validateAll('street-number').then((result) => {
                    if (result)
                        console.log('Validated!')
                });
            },
            test: function () {
                console.log('test');
            }
        }
    };
</script>

<style lang="scss">
    .row {
        margin: 10px 0;

        .invalid {
            color: red;
            margin-left: 10px;
        }
    }
</style>