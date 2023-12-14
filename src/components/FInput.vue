<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  id?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  type?: string
}>(), {
  disabled: false,
  type: 'text',
})

const emit = defineEmits<{
  update: [modelValue: string]
}>()

const value = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div
    class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-700 focus-within:ring-2 focus-within:ring-green-800 bg-gray-950"
    :class="{
      'opacity-50': disabled,
    }"
  >
    <label
      v-if="label"
      :for="id"
      class="block text-xs font-medium"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="value"
      v-bind="$attrs"
      :type="type"
      :disabled="disabled"
      class="block w-full border-0 p-0 placeholder:opacity-75 focus:ring-0 sm:text-sm sm:leading-6 bg-transparent"
      :placeholder="placeholder"
    >
  </div>
</template>

<style scoped>

</style>
