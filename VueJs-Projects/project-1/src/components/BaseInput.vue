<script setup>
defineProps({
    label : {

        type : [String,Boolean],
        default : false

    },

    modelValue : {
        type : String,
        default : "",
    }
})
</script>
<template>
    <div class="mb-3">
        <label v-if="label" class="form-label">{{label}}</label>
        <input  class="form-control"
         :value="modelValue"
         @input = "$emit('updateModelValue', $event.target.value)" 
         v-bind="$attrs"
         >
    </div>
</template>

<script>
export default {
    name: "BaseInput",
}
</script>
