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
const checked = ref(false)
const selectTags = ref<string[]>([])

const selectTagsIds = computed(() => {
  return selectTags.value.join(',')
})
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
      required: true,
      message: '请输入标题'
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

const publishVideo = __.$Api.dynamic({
  url: '/api/mv/upload',
  axiosConfig: {
    showSuccess: true
  }
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

    const { width: thumb_width, height: thumb_height } = await get_image_size(images[0].file)
    console.log('thumb_height: ', thumb_height)
    console.log('thumb_width: ', thumb_width)

    await publishVideo({
      title,
      coins,
      tags,
      img_url: images[0].url,
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
  api: '/api/mv/preUpload'
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
          <div
            class="grid grid-cols-2 px-1 pb-1"
            style="--van-cell-vertical-padding: 0; --van-cell-horizontal-padding: 0"
          >
            <div>
              <dx-input-video v-model="formState.videos" :show-label="false"></dx-input-video>
              <div class="mt-0.5 text-mini text-base6">
                · 大小不超过
                <span class="text-primary">2GB</span>
              </div>
              <div class="text-mini text-base6">
                · 鼓励上传
                <span class="text-primary">5分钟以上</span>
                视频，更受用户喜爱
              </div>
            </div>
            <div>
              <dx-input-image
                v-model="formState.images"
                class="upload-image"
                tip="添加封面"
                :show-label="false"
                :limit="1"
              ></dx-input-image>
              <div class="mt-0.5 text-mini text-base6">
                · 上传
                <span class="text-primary">精美封面</span>
                有助于提高浏览量
              </div>
            </div>
          </div>
          <div class="bg-base10 py-0.5"></div>
          <van-field v-model="formState.title" clearable label="标题" placeholder="请在这里输入标题" />
          <van-field
            v-model="formState.coins"
            clearable
            type="number"
            label="价格"
            :max="data.price_max"
            :placeholder="`最高${data.price_max || 0}金币，不设置或者0为免费`"
          />

          <div class="mt-1 px-1 text-sm text-base6">
            <span class="text-primary">{{ data.price_strong }}</span>
            <template v-if="data.price_text">
              ，{{
                data.price_text
                  .split('#txt#，')
                  .filter(i => i)
                  .join(',')
              }}
            </template>
          </div>
          <van-field
            v-model="selectTagsIds"
            class="mt-1"
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
            <div class="tag-list">
              <scroll-list>
                <div class="grid grid-cols-4 gap-0.5 px-1 pb-1 text-center text-sm">
                  <div
                    v-for="(tag, index) in data.tags"
                    :key="index"
                    class="tag-item truncate"
                    :class="{
                      'tag-item-active': selectTags.includes(tag)
                    }"
                    @click="onSelectTag(tag)"
                  >
                    {{ tag }}
                  </div>
                </div>
              </scroll-list>
            </div>
          </van-action-sheet>
        </van-form>
      </scroll-list>
    </div>
    <div class="van-safe-area-bottom m-1">
      <div class="flex justify-center">
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
}
.tag-item {
  background-color: #e5f0ff;
  color: var(--dx-primary-color);
  padding: 6px 0;
  border-radius: 4px;
  &-active {
    background-color: var(--dx-primary-color);
    color: #fff;
  }
}
.tag-input {
  &::placeholder {
    color: var(--van-field-placeholder-text-color);
  }
}
.upload-image {
  border-radius: 4px;
  :deep(.van-uploader) {
    width: 100%;
    height: 96px;

    .van-uploader__preview {
      width: 100%;
      height: 100%;
      margin: 0;
    }
    .van-uploader__input-wrapper,
    .van-uploader__preview-image {
      width: 100%;
      height: 100%;

      .my-uploader {
        width: 100%;
      }
    }
  }
}
</style>
