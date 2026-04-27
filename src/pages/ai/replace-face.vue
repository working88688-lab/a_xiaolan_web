<script setup lang="ts">
import DOMPurify from 'dompurify'
const __ = useNuxtApp()

const tpl_images = ref([])
const images = ref([])
const is_custom_tpl = ref(false)
const options = ref({} as any)
const route = useRoute()

const { value: paying } = useBoolean()
const { value: show_buy, open: open_buy } = useBoolean()
const { setMetaTitle, setNavbarTitle } = useNavbarTitle()
const { u: user } = storeToRefs(useUserStore())
const { cache } = storeToRefs(useDynamicStore())

const {
  data,
  execute,
  loading: spining
} = useMyFetch<any>({
  api: 'api/ai/pre_face'
})

async function upload_tpl_image(_file: any) {
  try {
    const res = await onImageUpload(_file, 'ground')

    options.value = {
      ...options.value,
      ...res
    }
  } catch (error) {}
}

async function upload_image(_file: any) {
  try {
    const res = await onImageUpload(_file)

    options.value = {
      ...options.value,
      ...res
    }
  } catch (error) {}
}

async function onImageUpload(_file: any, prefix = 'thumb') {
  try {
    _file.status = 'uploading'
    const file = await image_compressor(_file.file)

    const thumb = (await __.$Api.uploadImage({ file, useCompress: false })) as unknown as string
    const size = await get_image_size(file)
    _file.url = thumb
    _file.status = 'done'
    return {
      [`${prefix}`]: thumb,
      [`${prefix}_w`]: size.width,
      [`${prefix}_h`]: size.height
    }
  } catch (error) {
    _file.status = 'failed'
    return Promise.reject(error)
  }
}

function delete_custom_tpl() {
  // is_custom_tpl.value = false

  options.value.ground = ''
}
function delete_tpl_img() {
  is_custom_tpl.value = true
}

function delete_target_image() {
  options.value.thumb = ''
}

function onPay() {
  options.value = {}
  tpl_images.value = []
  images.value = []
  is_custom_tpl.value = false
  __.$Alert({
    title: '支付成功',
    message: '提交成功，稍后请前往【AI换脸-我的记录】中查看！'
  })

  execute()
}

const { key } = useKeepAlive({
  active: () => {
    if (!route.query.id) {
      execute()
      is_custom_tpl.value = true
    } else {
      execute({
        id: route.query.id
      })
    }
  },

  effect() {
    if (is_custom_tpl.value) {
      setTimeout(() => {
        setNavbarTitle('定制模板')
      }, 0)
    } else {
      setMetaTitle()
    }
  },

  reset() {
    options.value = {}
    is_custom_tpl.value = false
    images.value = []
    tpl_images.value = []
  }
})
const router = useRouter()
function submit(type: number) {
  if (show_buy.value || paying.value) return
  if (is_custom_tpl.value) {
    if (!options.value.ground) {
      return __.$Alert('请上传模板')
    }
  }
  if (!options.value.thumb) {
    return __.$Alert('请上传图片')
  }
  const user_coins = user.value.coins
  const message =
    type === 1
      ? '免费次数不足'
      : () =>
          h('div', null, [
            h('div', null, '您的余额不足，请充值'),
            h('div', null, [h('span', null, '剩余金币：'), h('span', { class: 'text-primary' }, user_coins)])
          ])
  if (
    (type === 0 &&
      (is_custom_tpl.value
        ? data.value.ai_ht_coins > user_coins
        : cache.value[CACHE_KEY.AI_FACE].coins > user_coins)) ||
    (type === 1 && Number(data.value.free_num) === 0)
  ) {
    return __.$Alert({
      message,
      confirmButtonText: '前往充值',
      showCancelButton: true,
      cancelButtonText: '分享好友',
      beforeClose(action: string) {
        if (action === 'confirm') {
          router.push('/coin-recharge?type=1')
        }

        if (action === 'cancel') {
          router.push('/invite')
        }

        return true
      }
    })
  }

  options.value = {
    ...options.value,
    type,
    material_id: is_custom_tpl.value ? undefined : cache.value[CACHE_KEY.AI_FACE].id
  }
  open_buy()
}

watch(is_custom_tpl, val => {
  if (val) {
    setNavbarTitle('定制模板')
  } else {
    setMetaTitle()
  }
})
</script>

<template>
  <div v-if="key" :key="key" class="container">
    <scroll-list :loading="spining">
      <div class="dx-grid-2">
        <div>
          <div v-if="is_custom_tpl" class="h-[230px] rounded-sm bg-mgray">
            <van-field class="my-upload h-full w-full" name="uploader" label-align="top">
              <template #input>
                <van-uploader
                  v-model="tpl_images"
                  :max-size="2 * 1024 * 1024"
                  reupload
                  :preview-full-image="false"
                  :after-read="upload_tpl_image"
                  accept="image/*"
                  :max-count="1"
                  @delete="delete_custom_tpl"
                >
                  <div v-if="tpl_images.length < 1" class="flex-col-center h-full w-full px-3">
                    <img class="!size-4" src="~/assets/image-icon/upload_image_2.png" alt="icon" />
                    <span class="mt-0.5 text-center text-mini leading-[1.4]">
                      点击上传模板 图片大小不超过{{ data.max_size }}
                    </span>
                  </div>

                  <template #preview-delete>
                    <nuxt-icon class="rounded-full bg-white text-4xl text-primary" name="minus" />
                  </template>
                </van-uploader>
              </template>
            </van-field>
          </div>
          <div v-else class="aspect-h-4 aspect-w-3 h-[230px] overflow-hidden rounded-sm">
            <dx-image class="h-[230px]" :src="cache[CACHE_KEY.AI_FACE].thumb" />
            <div class="h-[230px]">
              <div class="flex justify-end">
                <nuxt-icon class="rounded-full bg-white text-4xl text-primary" name="minus" @click="delete_tpl_img" />
              </div>
            </div>
          </div>
          <!-- <div class="mt-1 text-center font-medium">图片名称</div> -->
        </div>
        <div>
          <div class="h-[230px] rounded-sm bg-mgray">
            <van-field class="my-upload h-full w-full" name="uploader" label-align="top">
              <template #input>
                <van-uploader
                  v-model="images"
                  reupload
                  :preview-full-image="false"
                  :after-read="upload_image"
                  accept="image/*"
                  :max-count="1"
                  @delete="delete_target_image"
                >
                  <div v-if="images.length < 1" class="flex-col-center h-full w-full px-3">
                    <img class="!size-4" src="~/assets/image-icon/upload_image_2.png" alt="icon" />
                    <span class="mt-0.5 text-center text-mini leading-[1.4]">
                      点击上传人脸照片 图片大小不超过{{ data.max_size }}
                    </span>
                  </div>

                  <template #preview-delete>
                    <nuxt-icon class="rounded-full bg-white text-4xl text-primary" name="minus" />
                  </template>
                </van-uploader>
              </template>
            </van-field>
          </div>
          <!-- <div class="mt-1 text-center font-medium">上传脸部信息</div> -->
        </div>
      </div>
      <div>
        <div class="mb-1 mt-2 px-1">脸部注意事项：</div>
        <div
          class="mb-2.5 mt-2 whitespace-pre-line px-1"
          v-html="DOMPurify.sanitize(data.ai_ht_tips ?? '')"
        />

        <div class="dx-grid-3">
          <div class="flex-col-center">
            <div class="mb-1 h-6 w-6">
              <dx-image :src="data.exp_correct_img" />
            </div>
            <span>正确无遮挡</span>
          </div>
          <div class="flex-col-center">
            <div class="mb-1 h-6 w-6">
              <dx-image :src="data.exp_error1_img" />
            </div>
            <span>遮挡脸部</span>
          </div>
          <div class="flex-col-center">
            <div class="mb-1 h-6 w-6">
              <dx-image :src="data.exp_error2_img" />
            </div>
            <span>遮挡眼睛</span>
          </div>
        </div>
      </div>

      <div class="dx-grid-1 mt-3">
        <dx-button
          v-if="data.free_num && cache[CACHE_KEY.AI_FACE].type === 1"
          :round="false"
          block
          loading-text="提交中..."
          :loading="paying || show_buy"
          :disabled="paying || show_buy"
          @click="submit(1)"
        >
          <span class="text-normal">免费生成（剩余{{ data.free_num }}次）</span>
        </dx-button>
        <dx-button
          v-else
          class="text-white"
          :round="false"
          color="linear-gradient(to right, #FFC300, #FFB052)"
          loading-text="提交中..."
          :loading="paying || show_buy"
          :disabled="paying || show_buy"
          @click="submit(0)"
        >
          <span class="text-normal text-[#9E4800]">
            需消耗{{ is_custom_tpl ? data.ai_ht_coins : (cache[CACHE_KEY.AI_FACE].coins ?? 0) }}金币（可用余额{{
              user.coins
            }}）生成
          </span>
        </dx-button>
      </div>

      <!-- 评论（全部留言已关闭） -->
      <!--
      <div v-if="route.query.id" class="mt-2 px-1">
        <h4 class="mb-2 text-default font-semibold">全部留言（{{ data.detail?.comment_num ?? 0 }}）</h4>
        <div class="grid grid-cols-1 gap-1">
          <ai-comment-item v-for="item in listData" :key="item.id" :item="item" @comment="onBeforeComment">
            <template #right="{ comment }">
              <dx-btn-like
                :id="comment.id"
                class="ml-auto"
                align="row"
                :like="comment.is_like === 1"
                api="api/ai/like_comment"
                :likes="comment.like_num"
                icon="good-job-o"
                active-icon="good-job"
                :params="{
                  type: 1,
                  action_type: 0
                }"
                :use-toast="false"
                active-color="#f7931d"
              />
            </template>
          </ai-comment-item>
        </div>
      </div>
      -->
    </scroll-list>
    <!-- 底部评论（留言输入已关闭） -->
    <!--
    <dx-comment-input
      v-if="route.query.id"
      ref="commentRef"
      v-model="commentValue"
      v-model:reply="reply"
      style="--dx-base2-color: #898989; --dx-base10-color: #e2e2e2"
      class="whitespace-nowrap bg-[#F3F3F3]"
      api="api/ai/commentnew"
      :params="{ comment_id: reply.id, material_id: route.query.id }"
      @success="refresh_comments"
    >
      <template #left>
        <dx-btn-like
          :id="route.query.id"
          :like="data.detail?.is_like === 1"
          :likes="data.detail?.like"
          api="api/ai/like_comment"
          :use-toast="false"
          size="0.5rem"
          icon="like-o"
          active-icon="like"
          active-color="#FF0000"
          :params="{
            type: 0,
            action_type: 0
          }"
        >
          <template #default>
            <span class="text-tiny">点赞</span>
          </template>
        </dx-btn-like>
        <dx-btn-like
          :id="route.query.id"
          class="mx-1"
          :like="data.detail?.is_favorite === 1"
          :likes="data.detail?.like"
          api="api/ai/like_comment"
          :use-toast="false"
          size="0.5rem"
          icon="star-o"
          active-icon="star"
          active-color="#FF0000"
          :params="{
            type: 0,
            action_type: 1
          }"
        >
          <template #default>
            <span class="text-tiny">收藏</span>
          </template>
        </dx-btn-like>
      </template>
    </dx-comment-input>
    -->
    <!-- 购买提示弹框 -->
    <dx-buy-popup
      v-model:paying="paying"
      v-model:show="show_buy"
      :api="is_custom_tpl ? 'api/ai/customize_face' : 'api/ai/change_face'"
      :params="options"
      :show-success-alert="false"
      :coins="Number(is_custom_tpl ? data.ai_ht_coins : cache[CACHE_KEY.AI_FACE].coins)"
      :free-num="data.free_num"
      :pay-type="options.type ? 2 : 1"
      success-text="上传成功,等待处理"
      :success-handler="res => res.status === 1"
      type="face"
      @pay:success="onPay"
    />
  </div>
</template>

<style lang="postcss" scoped>
.my-upload {
  --van-cell-background: #f0f0f0;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px dashed #7a7a7a;

  :deep(.van-uploader__preview),
  :deep(.van-uploader__wrapper),
  :deep(.van-field__control),
  :deep(.van-field__body),
  :deep(.van-uploader),
  :deep(.van-image),
  :deep(.van-cell__value) {
    width: 100%;
    height: 230px;
    margin: 0;
  }

  :deep(.van-uploader) {
    border-radius: 4px;
    overflow: hidden;
  }
}

:deep(.van-uploader__preview-delete) {
  background-color: #fff;
  border-radius: 50%;
}
</style>
