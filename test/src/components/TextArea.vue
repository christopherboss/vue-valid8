<template>
    <div>
        <textarea :value="modelValue"
                  @input="$emit('update:modelValue', $event.target.value)"
        ></textarea>
    </div>
</template>

<script>
    export default {
        name: 'TextArea',
        emits: ['input', 'update:modelValue'],
        props: {
            modelValue: String
        }
    };
</script>