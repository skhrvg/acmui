<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheStatus from '@/components/TheStatus.vue'
import TheError from '@/components/TheError.vue'
</script>

<template>
  <TheStatus />
  <RouterView />
  <TheError />
</template>
