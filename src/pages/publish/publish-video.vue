<script setup lang="ts">
import type { ForumItem } from '@types'
import type { UploaderFileListItem } from 'vant'
const __ = useNuxtApp()

const formState = reactive({
  title: '',
  coins: undefined,
  images: [] as unknown as UploaderFileListItem[],
  videos: [] as unknown as UploaderFileListItem[]
})
const checked = ref(true)
const selectTags = ref<string[]>([])

const selectTagsIds = computed(() => {
  return selectTags.value.join(',')
})
const searchKeyword = ref('')
const filteredTags = computed(() => {
  const tags = (data.value?.tags ?? []) as string[]
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return tags
  return tags.filter(tag => tag.toLowerCase().includes(keyword))
})
function clearTagSearch() {
  searchKeyword.value = ''
}
function onSelectTag(tag: string) {
  const index = selectTags.value.indexOf(tag)
  if (index !== -1) {
    selectTags.value.splice(index, 1)
  } else {
    if (selectTags.value.length < 5) {
      selectTags.value.push(tag)
    } else {
      __.$Toast('最多选择5个标签')
    }
  }
}

const { validate } = useValidator({
  videos: {
    type: 'array',
    required: true,
    message: '请添加视频',
    min: 1
  },
  images: {
    type: 'array',
    required: true,
    message: '请添加视频封面',
    min: 1
  },
  title: [
    {
      type: 'string',
      max: 50,
      required: true,
      message: '请输入标题，最多50个字'
    }
  ],
  tags: [
    {
      type: 'string',
      required: true,
      message: '请选择标签'
    }
  ]
})

const publishing = ref(false)
async function onSubmit() {
  try {
    const { title, coins, videos, images } = formState
    publishing.value = true
    const tags = selectTagsIds.value
    await validate({
      title,
      coins,
      videos,
      images,
      tags
    })
    if (!checked.value) {
      return __.$Toast('请阅读并同意小蓝视频上传规范')
    }

    const firstImage = images[0]
    const { width: thumb_width, height: thumb_height } = await get_image_size(firstImage!.file as File)
    console.log('thumb_height: ', thumb_height)
    console.log('thumb_width: ', thumb_width)

    await __.$Api.Video.upload({
      title,
      coins,
      tags,
      img_url: (images[0] as any).remoteUrl || images[0].url,
      url: videos[0].url,
      thumb_width,
      thumb_height
    })
    reset()
  } catch (error) {
    console.log('error: ', error)
  } finally {
    publishing.value = false
  }
}

const { value: showPicker, open, close } = useBoolean()

const {
  data,
  execute: preUpload,
  loading
} = useMyFetch<any>({
  api: __.$Api.Video.preUpload
})

function reset() {
  formState.coins = undefined
  formState.images = []
  formState.videos = []
  formState.title = ''
  selectTags.value = []
}

const { key } = useKeepAlive({
  reset: () => {
    reset()
  },
  active() {
    preUpload()
  }
})
watch(showPicker, val => {
  if (!val) {
    searchKeyword.value = ''
  }
})
</script>
<template>
  <div v-if="key" :key="key" class="container">
    <dx-navbar class="my-nav-bar" :border="false" title="发布视频" left-arrow @click-left="$router.back">
      <!-- <template #right>
        <div class="header-right">上传管理</div>
      </template> -->
    </dx-navbar>
    <div class="scroll-container">
      <scroll-list :loading="loading">
        <van-form>
          <div class="px-1.5 pb-1" style="--van-cell-vertical-padding: 0; --van-cell-horizontal-padding: 0">
            <div class="form-section">
              <div class="section-header">
                <div class="section-title">上传视频</div>
                <div class="section-subtitle">不超过2GB</div>
              </div>
              <div class="section-body">
                <dx-input-video v-model="formState.videos" :show-label="false"></dx-input-video>
              </div>
              <div class="section-desc">上传5分钟以上视频，能获得更多的曝光机会</div>
            </div>

            <div class="form-section">
              <div class="section-header">
                <div class="section-title">上传封面</div>
                <div class="section-subtitle">不超过10MB</div>
              </div>
              <div class="section-body">
                <dx-input-image
                  v-model="formState.images"
                  class="upload-image"
                  tip="上传封面"
                  :show-label="false"
                  :limit="1"
                ></dx-input-image>
              </div>
              <div class="section-desc">上传精美封面，能获取更多的关注</div>
            </div>
          </div>
          <div class="form-section">
            <div class="section-header px-1.5">
              <div class="section-title">标题</div>
            </div>
            <div class="section-body overflow-hidden !rounded-[12px] px-1.5">
              <van-field
                v-model="formState.title"
                class="title-field"
                type="textarea"
                rows="4"
                autosize
                clearable
                :border="false"
                maxlength="50"
                show-word-limit
                placeholder="请输入标题（最多50字）"
              />
            </div>
          </div>
          <van-field
            v-model="formState.coins"
            class="price-field"
            clearable
            type="number"
            label="价格"
            :max="data.price_max"
            :placeholder="`最高${data.price_max || 0}金币，不设置或者0为免费`"
          />

          <div class="mt-1 px-1 text-sm text-base6">
            <span class="price-strong">{{ data.price_strong }}</span>
            <template v-if="data.price_text">
              ，{{
                data.price_text
                  .split('#txt#，')
                  .filter((text: string) => text)
                  .join(',')
              }}
            </template>
          </div>
          <van-field
            v-model="selectTagsIds"
            class="tag-field mt-1"
            is-link
            readonly
            name="picker"
            label="标签"
            :border="false"
            placeholder="请选择标签，最多选择5个"
            :clickable="false"
            @click="open"
          >
            <template #input>
              <div class="flex-1">
                <div v-if="selectTags.length" class="flex items-center gap-0.5 text-center">
                  <div v-for="tag in selectTags" :key="tag" class="tag-item w-[50px] truncate !py-0.5 !text-mini">
                    #{{ tag }}
                  </div>
                </div>
                <input
                  v-else
                  type="text"
                  class="tag-input w-full"
                  name="picker"
                  readonly
                  placeholder="请选择标签，最多选择5个"
                />
              </div>
            </template>
          </van-field>

          <van-action-sheet v-model:show="showPicker" teleport="body" title="添加标签">
            <div class="tag-sheet-body">
              <div class="tag-search">
                <div class="tag-search-input">
                  <input v-model="searchKeyword" type="text" class="tag-search-input-inner" placeholder="请输入" />
                  <van-icon v-if="searchKeyword" name="cross" class="tag-search-clear" @click="clearTagSearch" />
                </div>
              </div>

              <div class="tag-list">
                <div class="tag-scroll">
                  <template v-if="filteredTags.length">
                    <div class="tag-grid">
                      <div
                        v-for="(tag, index) in filteredTags"
                        :key="index"
                        class="tag-item"
                        :class="{
                          'tag-item-active': selectTags.includes(tag)
                        }"
                        @click="onSelectTag(tag)"
                      >
                        {{ tag }}
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="tag-empty">暂无匹配的标签</div>
                  </template>
                </div>
              </div>

              <div class="tag-footer">
                <dx-button block @click="close">确定</dx-button>
              </div>
            </div>
          </van-action-sheet>
        </van-form>
      </scroll-list>
    </div>
    <div class="van-safe-area-bottom m-1">
      <div class="flex justify-start">
        <van-checkbox v-model="checked" class="mb-1">
          请同意并遵守
          <dx-link to="/publish/video-rule" class="text-primary" @click.stop>《小蓝视频上传规范》</dx-link>
        </van-checkbox>
      </div>
      <dx-button :round="false" :disabled="loading" :loading="publishing" block @click="onSubmit">发布</dx-button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.container {
  --van-field-label-width: 40px;
  --van-checkbox-size: 20px;
}

:deep(.van-checkbox__label) {
  font-size: 13px;
  line-height: 20px;
  vertical-align: middle;
}

:deep(.van-checkbox) {
  align-items: center;
}

.form-section + .form-section {
  margin-top: 13px;
}
.section-header {
  display: flex;
  align-items: center;
}
.section-title {
  color: #151515;
  font-size: 14px;
  line-height: 20px;
}
.section-subtitle {
  margin-left: 4px;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.55);
}
.section-body {
  margin-top: 10px;
}
.section-desc {
  margin-top: 4px;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.55);
}
:deep(.van-cell) {
  background-color: transparent !important;
}
:deep(.my-uploader) {
  width: 256px;
  height: 144px;
  border-radius: 10px;
}
.title-field {
  margin-top: 0;
  background-color: #f7f7f7;
}
.title-field :deep(.van-field__control) {
  background-color: #f7f7f7;
  border-radius: 10px;
  padding: 8px 10px;
}
.price-strong {
  color: #151515;
  font-weight: 500;
}
.price-field :deep(.van-field__label),
.tag-field :deep(.van-field__label) {
  font-size: 14px;
  color: #151515;
}
.tag-sheet-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px 16px 16px;
}
.tag-search {
  margin-bottom: 12px;
}
.tag-search-input {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 32px;
  border-radius: 16px;
  background-color: #f3f3f3;
}
.tag-search-input-inner {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
}
.tag-search-input-inner::placeholder {
  color: #b3b3b3;
}
.tag-search-clear {
  font-size: 16px;
  color: #b3b3b3;
}
.tag-list {
  margin-top: 4px;
}
.tag-scroll {
  max-height: 144px;
  overflow-y: auto;
}
.tag-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 4px 0 12px;
}
.tag-item {
  padding: 6px 0;
  font-size: 13px;
  text-align: center;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #333;
}
.tag-item-active {
  background-color: var(--dx-primary-color);
  color: #fff;
}
.tag-empty {
  padding: 16px 0;
  text-align: center;
  font-size: 13px;
  color: #999;
}
.tag-footer {
  margin-top: 8px;
}
.tag-input {
  &::placeholder {
    color: var(--van-field-placeholder-text-color);
  }
}
</style>
