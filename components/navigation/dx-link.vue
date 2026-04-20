<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  // add @ts-ignore if using TypeScript
  ...RouterLink.props,
  inactiveClass: String,
  to: {
    type: String,
    default: ''
  }
})

const isExternalLink = computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})

function _to(navigate) {
  if (props.to) {
    navigate()
  }
}
</script>

<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <nuxt-link v-else v-slot="{ isActive, href, navigate }" v-bind="$props" custom>
    <span
      class="cursor-pointer"
      v-bind="$attrs"
      :href="href"
      :class="isActive ? activeClass : inactiveClass"
      @click="_to(navigate)"
    >
      <slot />
    </span>
  </nuxt-link>
</template>
