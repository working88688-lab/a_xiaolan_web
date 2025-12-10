<template>
  <div ref="root_ref" class="dx-form-item van-cell !p-0">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import type { CustomRule } from '@types'
import { FORM_RULES } from '@utils/constants/form'

const props = defineProps<{
  name?: string
  rule?: CustomRule
}>()

const provide_form = inject(FORM_RULES)
const root_ref = ref()

const add_rule = async () => {
  await nextTick()
  provide_form?.add_rule(props.name, props.rule, root_ref.value)
}

watch(() => [props.name, props.rule], add_rule)

onMounted(add_rule)
</script>

<style scoped></style>
