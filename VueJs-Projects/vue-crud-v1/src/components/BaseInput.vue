<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    label: {
        type: [String, Boolean],
        default: false
    },
    modelValue: {
        type: String,
        default: ""
    }
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div class="mb-3">
        <label v-if="props.label" class="form-label">{{ props.label }}</label>
        <input
            class="form-control custom-input"
            :value="props.modelValue"
            @input="event => emit('update:modelValue', event.target.value)"
            v-bind="$attrs"
        >
    </div>
</template>

<script>
export default {
    name: "BaseInput",
}
</script>

<style scoped>
.custom-input:focus {
    /*background-color: #e6f5ea; /* Change this to your desired focus background color */
    border-color: #42b983; /* Change this to your desired focus border color */
    /*color: #155724; /* Change this to your desired focus text color */
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25); /* Adjust this for your desired box shadow */
}
</style>
