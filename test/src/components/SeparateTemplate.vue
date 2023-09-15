<template>
    <div class="row">
        <h2>Separate Template</h2>
        <label>Address: </label>
        <input name="address"
            scope="separate"
            type="text"
            v-model="address"
            v-validate="'required|alpha-spaces'"
        >
        <span class="invalid"
              v-if="validator.invalid('address')"
        >
            {{ validator.message('address') }}
        </span>
    </div>
</template>

<script>
    export default {
        name: 'SeparateTemplate',
        inject: ['validator'],
        data: function () {
            return {
                address: ''
            }
        }
    }
</script>