<script setup lang="ts">
import TheError from './components/TheError.vue'
import TheStatus from './components/TheStatus.vue'
</script>

<template>
  <TheStatus />
  <RouterView />
  <TheError />
</template>
