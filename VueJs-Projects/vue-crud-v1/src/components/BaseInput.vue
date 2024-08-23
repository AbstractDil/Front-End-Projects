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

function onInput(event) {
  // Emit the update event only if the value has changed
  if (event.target.value !== props.modelValue) {
    emit('update:modelValue', event.target.value);
  }
}

</script>

<template>
    <div class="mb-3">
        <label v-if="label" class="form-label">{{ label }}</label>
        <input 
            class="form-control custom-input"
            :value="modelValue"
            @input="onInput"
            v-bind="$attrs"
        >
    </div>
</template>

<style scoped>
.custom-input:focus {
    /*background-color: #e6f5ea; /* Change this to your desired focus background color */
    border-color: #42b983; /* Change this to your desired focus border color */
    /*color: #155724; /* Change this to your desired focus text color */
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25); /* Adjust this for your desired box shadow */
}
</style>
