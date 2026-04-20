<template>
  <van-popup v-model:show="innerShow" teleport="body" position="bottom" round :style="{ height: '55vh' }">
    <div class="profile-popup">
      <div class="profile-popup__header">
        <div class="profile-popup__title">我的资料</div>
        <div class="profile-popup__close" @click="close">×</div>
      </div>

      <div v-if="loadError" class="profile-popup__hint">加载失败，请稍后重试</div>

      <div v-else class="profile-popup__body">
        <div v-if="loading" class="profile-popup__loading">
          <van-loading type="spinner" size="28px" />
        </div>

        <template v-else>
          <div class="profile-popup__section">
            <div class="profile-popup__section-title">个人标签（可多选）</div>
            <div class="profile-popup__tags">
              <button
                v-for="tag in personalTagList"
                :key="tag.id"
                type="button"
                class="profile-popup__tag"
                :class="{ 'profile-popup__tag--active': isSelected(tag.id) }"
                @click="toggleId(tag.id)"
              >
                {{ tag.name }}
              </button>
            </div>
          </div>

          <div class="profile-popup__section">
            <div class="profile-popup__section-title">个人倾向（可多选）</div>
            <div class="profile-popup__tags">
              <button
                v-for="tag in orientationTagList"
                :key="tag.id"
                type="button"
                class="profile-popup__tag"
                :class="{ 'profile-popup__tag--active': isSelected(tag.id) }"
                @click="toggleId(tag.id)"
              >
                {{ tag.name }}
              </button>
            </div>
          </div>

          <div class="profile-popup__section">
            <div class="profile-popup__section-title">个人性癖好（可多选）</div>
            <div class="profile-popup__tags">
              <button
                v-for="tag in hobbyTagList"
                :key="tag.id"
                type="button"
                class="profile-popup__tag"
                :class="{ 'profile-popup__tag--active': isSelected(tag.id) }"
                @click="toggleId(tag.id)"
              >
                {{ tag.name }}
              </button>
            </div>
          </div>
        </template>
      </div>

      <div class="profile-popup__footer">
        <button
          class="profile-popup__submit"
          type="button"
          :disabled="loading || submitting || loadError"
          @click="onSubmit"
        >
          {{ submitting ? '保存中…' : '完成' }}
        </button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
export type ProfileTagItem = {
  id: number
  name: string
  type?: number
  status?: number
  weight?: number
  sort_num?: number
}

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const __ = useNuxtApp()

const innerShow = computed({
  get() {
    return props.show
  },
  set(value: boolean) {
    emit('update:show', value)
  }
})

const loading = ref(false)
const loadError = ref(false)
const submitting = ref(false)

const personalTagList = ref<ProfileTagItem[]>([])
const orientationTagList = ref<ProfileTagItem[]>([])
const hobbyTagList = ref<ProfileTagItem[]>([])
/** 当前勾选标签 id */
const selectedIds = ref<number[]>([])

function isProfileTagSelected(status: number | undefined) {
  return Number(status) === 1
}

function parseProfileGroups(raw: unknown) {
  if (!raw || typeof raw !== 'object') {
    return { '1': [] as ProfileTagItem[], '2': [], '3': [] }
  }
  const o = raw as Record<string, unknown>
  const pick = (k: string) => (Array.isArray(o[k]) ? (o[k] as ProfileTagItem[]) : [])
  return {
    '1': pick('1'),
    '2': pick('2'),
    '3': pick('3')
  }
}

function applyProfileData(data: unknown) {
  const { '1': g1, '2': g2, '3': g3 } = parseProfileGroups(data)
  personalTagList.value = g1
  orientationTagList.value = g2
  hobbyTagList.value = g3
  const next: number[] = []
  for (const tag of [...g1, ...g2, ...g3]) {
    if (tag?.id != null && isProfileTagSelected(tag.status)) {
      next.push(Number(tag.id))
    }
  }
  selectedIds.value = next
}

async function fetchMyProfile() {
  loading.value = true
  loadError.value = false
  try {
    const { data } = await __.$Api.User.myProfile({})
    applyProfileData(data)
  } catch {
    loadError.value = true
    personalTagList.value = []
    orientationTagList.value = []
    hobbyTagList.value = []
    selectedIds.value = []
  } finally {
    loading.value = false
  }
}

watch(
  () => props.show,
  open => {
    if (open) {
      fetchMyProfile()
    }
  }
)

function isSelected(id: number) {
  return selectedIds.value.includes(id)
}

function toggleId(id: number) {
  const arr = selectedIds.value
  const i = arr.indexOf(id)
  if (i > -1) {
    arr.splice(i, 1)
  } else {
    arr.push(id)
  }
}

const close = () => {
  emit('update:show', false)
}

const onSubmit = async () => {
  if (loading.value || loadError.value || submitting.value) return
  submitting.value = true
  try {
    const tag_ids = [...selectedIds.value].sort((a, b) => a - b).join(',')
    await __.$Api.User.updateUserProfile({ tag_ids })
    close()
  } catch {
    // showSuccess / 全局错误处理
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="less" scoped>
.profile-popup {
  padding: 16px 16px 20px;
  background-color: #ffffff;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
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

  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  &__hint {
    padding: 24px 0;
    text-align: center;
    font-size: 14px;
    color: #9ca3af;
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  &__section {
    margin-bottom: 16px;
  }

  &__section-title {
    margin-bottom: 8px;
    font-size: 13px;
    color: #000000;
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
    background-color: #f6f6f6;
    color: #374151;
    font-size: 13px;
  }

  &__tag--active {
    background-color: #2494ff;
    color: #ffffff;
  }

  &__footer {
    margin-top: 12px;
    flex-shrink: 0;
  }

  &__submit {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    border: none;
    background-color: #2494ff;
    color: #ffffff;
    font-size: 16px;

    &:disabled {
      opacity: 0.55;
    }
  }
}
</style>
