<template>
    <div class="mb-3">
        <label v-if="label" class="form-label">{{ label }}</label>
        <input
            class="form-control custom-input"
            :value="modelValue"
            @input="updateValue"
            v-bind="$attrs"
        >
    </div>
</template>

<script>
export default {
    name: "BaseInput",
    props: {
        label: {
            type: [String, Boolean],
            default: false
        },
        modelValue: {
            type: String,
            default: ""
        }
    },
    methods: {
        updateValue(event) {
            this.$emit('update:modelValue', event.target.value);
        }
    }
}
</script>

<style scoped>
.custom-input:focus {
    border-color: #42b983; /* Change this to your desired focus border color */
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25); /* Adjust this for your desired box shadow */
}
</style>
