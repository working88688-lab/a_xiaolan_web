<template>
  <div class="vue-calendar">
    <img
      class="vue-calendar-trigger"
      :style="{ width: '0.53rem', height: '0.53rem' }"
      src="~/assets/image/discover/date_ico.png"
      alt=""
      @click="showPicker"
    />
    <div ref="pickerRef"></div>
  </div>
</template>

<script setup lang="ts">
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import local from 'flatpickr/dist/l10n/zh.js'

const pickerRef = ref()

const modelValue = defineModel({
  type: String,
  default: ''
})

const emit = defineEmits<{
  change: [e: string]
}>()
let instance: ReturnType<typeof flatpickr>
const showPicker = () => {
  instance.open()
}

onMounted(() => {
  instance = flatpickr(pickerRef.value, {
    locale: local.zh,
    dateFormat: 'Y-m-d',
    disableMobile: true,
    maxDate: new Date(),
    onChange: function (selectedDates, dateStr, instance) {
      if (dateStr !== modelValue.value) {
        modelValue.value = dateStr
        emit('change', dateStr)
      }
    }
  })
})

onBeforeUnmount(() => {
  instance?.destroy()
})
</script>

<style lang="less" scoped>
// .vue-calendar {
//   :deep(.flatpickr-input) {
//     display: none;
//   }
// }
</style>
