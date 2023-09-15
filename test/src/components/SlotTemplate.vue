<template>
    <div class="row">
        <h2>Slot Content</h2>
        <slot name="content"></slot>
    </div>
</template>

<script>
    export default {
        name: 'SlotContent'
    }
</script>