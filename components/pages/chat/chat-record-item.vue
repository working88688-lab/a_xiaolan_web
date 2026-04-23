<script setup lang="tsx">
const props = defineProps<{
  item: any
  createAt?: string
  replyAt?: string
}>()
const __ = useNuxtApp()

const { u: user } = storeToRefs(useUserStore())

const imageUrl = computed(() => {
  const it = props.item || {}
  const v =
    it.thumb_full ??
    it.images ??
    it.thumb ??
    it.image ??
    it.pic ??
    it.pic_url ??
    it.img ??
    it.img_url ??
    ''
  const direct = typeof v === 'string' ? v.trim() : ''
  if (direct) return direct

  // 兼容：如果后端只回传 content，但我们把图片 url 拼进了 content
  const content = typeof it.content === 'string' ? it.content.trim() : ''
  if (!content) return ''
  const m = content.match(/^\[图片\]\s+(https?:\/\/\S+)$/u)
  if (m?.[1]) return String(m[1]).trim()
  return ''
})

const textContent = computed(() => {
  const raw = props.item?.content
  const s = typeof raw === 'string' ? raw.trim() : ''
  if (!s) return ''
  // 图片消息为了会话列表摘要可能会塞一个占位文案，这里在明细里不展示
  if (imageUrl.value && (/^\[图片\]$/u.test(s) || /^\[图片\]\s+https?:\/\/\S+$/u.test(s))) return ''
  return s
})
</script>

<template>
  <div class="customer-service-item">
    <template v-if="item.content || imageUrl">
      <div class="title">{{ props?.createAt }}</div>
      <div class="mine-box">
        <div class="customer-service-avatar" />
        <div class="content">
          <div class="inner-box">
            <template v-if="textContent">
              {{ textContent }}
            </template>

            <div v-if="imageUrl" class="img-box">
              <img v-lazyLoad="imageUrl" data-image-preview="true" object-fit="contain" />
            </div>
          </div>
        </div>
        <div class="customer-service-avatar">
          <img v-lazyLoad="user?.avatar_url" class="rounded-full" object-fit="contain" />
        </div>
      </div>
    </template>
    <template v-if="item.reply_content">
      <div class="title">{{ props?.replyAt }}</div>
      <div class="system-box">
        <div class="customer-service-avatar">
          <img
            v-if="item?.from_avater_full"
            v-lazyLoad="item.from_avater_full"
            class="rounded-full"
            object-fit="contain"
          />
          <img v-else src="~/assets/image/logo.png" />
        </div>
        <div class="content">
          <div class="inner-box">{{ item?.reply_content }}</div>
        </div>
        <div class="customer-service-avatar" />
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
.customer-service-item {
  .title {
    font-size: 12px;
    color: var(--dx-base3-color);
    text-align: center;
    line-height: 16px;
    margin: 10px 0;
  }

  .mine-box,
  .system-box {
    padding: 0.2rem 0;
    display: flex;
    align-items: flex-start;

    .content {
      flex: 1;
      display: flex;

      .inner-box {
        padding: 0.25rem;
        font-size: 0.375rem;
        background: #fff;
        border-radius: 0.2rem;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          right: auto;
          left: -0.4rem;
          top: 0.2rem;
          border-left: 0.2rem solid transparent;
          border-right: 0.2rem solid #fff;
          border-top: 0.2rem solid transparent;
          border-bottom: 0.2rem solid transparent;
        }
      }
    }
  }

  .mine-box {
    .content {
      justify-content: flex-end;

      .inner-box {
        background: #e5f0ff;

        &::after {
          content: '';
          position: absolute;
          right: -0.4rem;
          left: auto;
          top: 0.2rem;
          border-left: 0.2rem solid #e5f0ff;
          border-right: 0.2rem solid transparent;
          border-top: 0.2rem solid transparent;
          border-bottom: 0.2rem solid transparent;
        }
      }
    }
  }
}
.customer-service-avatar {
  width: 1rem;
  height: 1rem;
  overflow: hidden;
  margin: 0 0.3rem;

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
