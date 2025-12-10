<template>
  <div class="dx-tag" :class="classNames">#{{ text }}</div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    coins?: number
    text?: string
    type?: number
  }>(),
  {
    coins: 0,
    text: '',
    type: 0
  }
)

const classNames = computed(() => {
  return props.type === 0 ? 'tag-item1' : 'tag-item'
})
</script>

<style lang="postcss">
.dx-tag {
  display: flex;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}
.tag-item {
  color: var(--dx-base2-color);
  background-color: #f2f2f2;
}

.tag-item1 {
  align-items: center;
  color: #fff;
  background-color: #ed9f2f;
  img {
    width: 0.3rem;
    height: 0.3rem;
    margin-right: 3px;
  }
}
</style>
