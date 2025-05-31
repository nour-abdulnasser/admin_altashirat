<template>
    <div class="error-layout overflow-hidden h-screen">
      <slot />
    </div>
  </template>
    
  <script setup>
  defineOptions({
    name: "ErrorLayout",
  });
  </script>