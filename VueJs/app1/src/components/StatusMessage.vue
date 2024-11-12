<!-- SuccessMessage.vue -->
<template>
    <div v-if="props.visible" class="min-vh-100 d-flex align-items-center justify-content-center py-4"> 
      <div class="card p-3" style="width:24em;">
        <div class="card-body text-center">
          <div class="fs-1 text-center mb-4 fw-bold" :class="props.iconClass">
            <i :class="icon"></i>
          </div>
  
          <h5 class="card-title text-center mb-4 fw-bold" :class="props.iconClass"> 
            {{ props.title }}
          </h5>
  
          <div class="card-text text-muted">
            {{ props.message }}
          </div>
  
          <button v-if="props.buttonText" class="btn btn-success mt-3" @click="handleClick">
            {{ props.buttonText }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Success'
    },
    message: {
      type: String,
      default: 'Operation was successful!'
    },
    icon: {
      type: String,
      default: 'bi bi-patch-check-fill'
    },
    iconClass: {
      type: String,
      default: 'text-success'
    },
    buttonText: {
      type: String,
      default: null
    }
  });
  
  const emit = defineEmits(['button-click']);
  
  const handleClick = () => {
    emit('button-click');
  };
  </script>
  
  <style scoped>
  .text-success {
    color: #28a745;
  }
  </style>
  