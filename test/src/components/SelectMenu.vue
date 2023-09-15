<template>
    <div class="select"
         :class="{ open }"
         :value="modelValue"
         v-on:click="open = !open"
    >
        <span :class="{ placeholder: !modelValue, selected: modelValue }"
              v-show="!open"
        >
            {{ modelValue.label || placeholder }}
        </span>

        <span class="chevron"
              v-if="open"
        >
            ▴
        </span>
        <span class="chevron"
              v-else
        >
            ▾
        </span>

        <div class="dropdown"
             ref="dropdown"
             v-if="open"
        >
            <ul>
                <li :class="{ selected: modelValue === option }"
                    v-for="option in options"
                    v-on:click="select(option)"
                >
                    {{ option.label }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SelectMenu',
        emits: ['change', 'update:modelValue'],
        props: {
            options: {
                required: true,
                type: Array
            },
            modelValue: [Object, String],
            placeholder: String
        },
        data: function () {
            return {
                open: false
            }
        },
        methods: {
            hide: function () {
                this.open = false;
            },
            select: function (option) {
                this.$emit('change', option);
                this.$emit('update:modelValue', option);
                this.$el.dispatchEvent(new Event('change'));
                this.$el.dispatchEvent(new Event('input'));
            }
        }
    }
</script>

<style lang="scss">
    .select {
        border: 1px solid #000;
        cursor: pointer;
        padding: 5px;
        width: 300px;
        position: relative;

        .chevron {
            position: absolute;
            right: 5px;
        }

        .dropdown {
            overflow: hidden;

            ul {
                list-style: none;
                margin: 0;
                padding: 0;

                li {
                    padding: 5px;

                    &:hover {
                        background-color: #F5F9FF;
                    }

                    &.selected {
                        background-color: #f5fffa;
                    }
                }
            }
        }

        .placeholder {
            display: inline-block;
            height: 14px;
        }
    }
</style>
