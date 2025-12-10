<template>
  <div v-if="key" :key="key" class="container">
    <dx-navbar
      class="my-nav-bar"
      :border="false"
      title="发布帖子"
      left-arrow
      @click-left="__.$Back"
      @click-right="$router.push('/post/rule')"
    >
      <template #right>
        <div class="header-right">发布规则</div>
      </template>
    </dx-navbar>
    <div class="scroll-container">
      <scroll-list>
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-if="!isQiupian"
              v-model="selectTopic.name"
              class="dx-form-input"
              is-link
              readonly
              name="picker"
              label-align="top"
              label="话题"
              placeholder="选择帖子主题"
              @click="showPicker = true"
            />

            <van-action-sheet v-model:show="showPicker" teleport="body" title="选择圈子" @open="onOpen">
              <div v-if="loading" class="flex-center my-1">
                <van-loading type="spinner" class="!text-primary"></van-loading>
              </div>
              <div class="topic-list">
                <div
                  v-for="(topic, index) in topics"
                  :key="index"
                  class="topic-list_item"
                  :class="{
                    'topic-list_item-active': selectTopic.id == topic.id
                  }"
                  @click="onSelectTopic(topic)"
                >
                  #{{ topic.name }}
                </div>
              </div>
            </van-action-sheet>

            <van-field
              v-model="formState.price"
              type="number"
              class="dx-form-input"
              :label="isQiupian ? '打赏金额' : '价格'"
              label-align="top"
              :placeholder="isQiupian ? '输入打赏金额' : '输入解锁金币，最高10金币'"
            />
            <van-field
              v-if="!isQiupian"
              v-model="formState.title"
              label="标题"
              label-align="top"
              class="dx-form-input"
              placeholder="填写帖子标题"
            />
            <van-field
              v-model="formState.content"
              rows="5"
              label-align="top"
              :label="isQiupian ? '求片内容' : '内容'"
              type="textarea"
              class="my-textarea dx-form-input"
              :placeholder="isQiupian ? '可输入想看的类型，片名，演员名称，番号' : '好的帖子内容能更好的吸引用户收藏'"
            />

            <dx-input-image v-model="formState.images" :limit="isQiupian ? 3 : 9"></dx-input-image>

            <dx-input-video v-if="!isQiupian" v-model="formState.videos"></dx-input-video>
          </van-cell-group>
          <div style="margin: 16px">
            <dx-button :round="false" block native-type="submit">提交</dx-button>
          </div>
        </van-form>
      </scroll-list>
    </div>
    <!-- <post-rule v-model:show="showRule"></post-rule> -->
  </div>
</template>

<script setup lang="ts">
import type { ForumItem } from '@types'
import type { UploaderFileListItem } from 'vant'

const __ = useNuxtApp()
const route = useRoute()
const isQiupian = ref(route.query.type === 'film')

const selectTopic = ref<ForumItem>({} as unknown as ForumItem)
const formState = reactive({
  topic_id: '',
  title: '',
  price: undefined,
  content: '',
  images: [] as unknown as UploaderFileListItem[],
  videos: [] as unknown as UploaderFileListItem[]
})

const { validate } = useValidator(
  isQiupian.value
    ? {
        title: [
          {
            type: 'string',
            required: true,
            message: '请输入内容'
          },
          { min: 10, message: '标题长度不小于10个字数' }
        ],
        images: {
          type: 'array',
          required: true,
          message: '请添加图片'
        }
      }
    : {
        topic_id: {
          type: 'number',
          required: true,
          message: '请选择话题'
        },
        title: [
          {
            type: 'string',
            required: true,
            message: '请输入标题'
          },
          { min: 8, message: '标题长度不小于8个字数' }
        ],
        content: {
          type: 'string',
          required: true,
          message: '请输入内容'
        },
        medias: {
          type: 'array',
          required: true,
          message: '请添加图片或者视频',
          min: 1
        }
      }
)

const onSubmit = async () => {
  try {
    if (isQiupian.value) {
      const { content: title, price: coins, images } = formState
      await validate({
        title,
        images
      })
      await __.$Api.Community.createFindPost({
        title,
        coins,
        images: images.map(item => item.url)
      })
    } else {
      const { content, price, images, title, videos } = formState
      const { id: topic_id } = selectTopic.value
      const medias = [...images, ...videos].map(item => ({ media_url: item.url }))
      await validate({
        title,
        content,
        topic_id,
        medias
      })

      await __.$Api.Community.createPost({
        title,
        content,
        price,
        topic_id,
        medias: JSON.stringify(medias),
        video_type: 'r2'
      })
    }

    __.$Replace(isQiupian.value ? `/post/publish-success` : `/post/publish-success?type=1`)
  } catch (error) {}
}

const showPicker = ref(false)

const onSelectTopic = (item: ForumItem) => {
  showPicker.value = false
  selectTopic.value = {
    ...item
  }
}

const {
  data: topics,
  execute,
  loading
} = useMyFetch<ForumItem[]>({
  api: __.$Api.Community.topics
})
const onOpen = () => {
  execute()
}

const { key } = useKeepAlive({
  reset: () => {
    formState.topic_id = ''
    formState.content = ''
    formState.price = undefined
    formState.images = []
    formState.videos = []
    formState.title = ''
    selectTopic.value = {} as unknown as ForumItem
  },
  active() {
    isQiupian.value = route.query.type === 'film'
  }
})
</script>

<style lang="postcss" scoped>
@import '@styles/publish-form';
</style>
