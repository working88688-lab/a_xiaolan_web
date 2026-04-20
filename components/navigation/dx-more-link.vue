<script setup lang="ts">
import type { RouteLocationAsRelativeGeneric } from 'vue-router'

const props = withDefaults(
  defineProps<{
    title?: string
    to?: RouteLocationAsRelativeGeneric | string
    icon?: string
    moreText?: string
    border?: boolean
    sticky?: boolean
  }>(),
  {
    icon: 'arrow-right',
    border: true,
    moreText: '更多'
  }
)
</script>

<template>
  <dx-link class="dx-more-link flex items-center justify-between" :class="{ 'is-sticky': props.sticky }" :to="to">
    <div
      class="dx-more-link--title text-2xl"
      :class="{
        'has-border': border
      }"
    >
      <slot name="title">
        {{ props.title }}
      </slot>
    </div>

    <slot name="more">
      <div class="text-base11 flex items-center">
        {{ moreText }}
        <div class="flex items-center rounded-full">
          <nuxt-icon class="mr-[-8px] text-4xl" :name="icon" />
        </div>
      </div>
    </slot>
  </dx-link>
</template>

<style lang="postcss" scoped>
.dx-more-link {
  &--title {
    &.has-border {
      position: relative;

      padding-left: 10px;
      &::before {
        position: absolute;
        left: 0;
        height: 70%;
        content: '';
        display: block;
        width: 4px;
        border-radius: 2px;
        background-color: var(--dx-primary-color);
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  &.is-sticky {
    position: sticky;
    top: 0;
    left: 0;
    background: var(--dx-container-color);
    z-index: 10;
    padding-top: 2px;
    padding-bottom: 2px;
  }
}
</style>
