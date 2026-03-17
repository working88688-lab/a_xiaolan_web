<template>
  <van-popup v-model:show="innerShow" teleport="body" position="bottom" round :style="{ height: '100%' }">
    <div class="profile-popup">
      <div class="profile-popup__header">
        <div class="profile-popup__title">我的资料</div>
        <div class="profile-popup__close" @click="close">×</div>
      </div>

      <div class="profile-popup__section">
        <div class="profile-popup__section-title">个人标签（可多选）</div>
        <div class="profile-popup__tags">
          <button
            v-for="item in personalTags"
            :key="item"
            type="button"
            class="profile-popup__tag"
            :class="{ 'profile-popup__tag--active': selectedPersonalTags.includes(item) }"
            @click="toggleTag('personal', item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <div class="profile-popup__section">
        <div class="profile-popup__section-title">个人倾向（可多选）</div>
        <div class="profile-popup__tags">
          <button
            v-for="item in orientationTags"
            :key="item"
            type="button"
            class="profile-popup__tag"
            :class="{ 'profile-popup__tag--active': selectedOrientationTags.includes(item) }"
            @click="toggleTag('orientation', item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <div class="profile-popup__section">
        <div class="profile-popup__section-title">个人性癖好（可多选）</div>
        <div class="profile-popup__tags">
          <button
            v-for="item in hobbyTags"
            :key="item"
            type="button"
            class="profile-popup__tag"
            :class="{ 'profile-popup__tag--active': selectedHobbyTags.includes(item) }"
            @click="toggleTag('hobby', item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <div class="profile-popup__footer">
        <button class="profile-popup__submit" type="button" @click="onSubmit">完成</button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const innerShow = computed({
  get() {
    return props.show
  },
  set(value: boolean) {
    emit('update:show', value)
  }
})

const personalTags = ['教练', '奶狗', 'xxx', 'xxxxxx', 'xxxxxx', 'xxxx']
const orientationTags = ['1', '0', '0.5', 'side']
const hobbyTags = ['教练', '奶狗', 'xxx', 'xxxxxx', 'xxxxxx', 'xxxx']

const selectedPersonalTags = ref<string[]>([])
const selectedOrientationTags = ref<string[]>([])
const selectedHobbyTags = ref<string[]>([])

const toggleTag = (type: 'personal' | 'orientation' | 'hobby', value: string) => {
  const target =
    type === 'personal' ? selectedPersonalTags : type === 'orientation' ? selectedOrientationTags : selectedHobbyTags

  const index = target.value.indexOf(value)
  if (index > -1) {
    target.value.splice(index, 1)
  } else {
    target.value.push(value)
  }
}

const close = () => {
  emit('update:show', false)
}

const onSubmit = () => {
  // 这里可以对接接口提交用户资料
  emit('update:show', false)
}
</script>

<style lang="less" scoped>
.profile-popup {
  padding: 16px 16px 20px;
  background-color: #f5f5f5;
  height: 100%;
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    color: #111827;
  }

  &__close {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #9ca3af;
  }

  &__section {
    margin-bottom: 16px;
  }

  &__section-title {
    margin-bottom: 8px;
    font-size: 13px;
    color: #4b5563;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tag {
    min-width: 56px;
    padding: 6px 10px;
    border-radius: 6px;
    border: none;
    background-color: #f3f4f6;
    color: #374151;
    font-size: 13px;
  }

  &__tag--active {
    background-color: #2f78ff;
    color: #ffffff;
  }

  &__footer {
    margin-top: 24px;
  }

  &__submit {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    border: none;
    background-color: #2f78ff;
    color: #ffffff;
    font-size: 16px;
  }
}
</style>
