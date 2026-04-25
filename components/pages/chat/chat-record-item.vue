<script setup lang="tsx">
const props = defineProps<{
  item: any
  createAt?: string
  replyAt?: string
}>()

const { u: user } = storeToRefs(useUserStore())

function normalizeChatImageUrl(input: unknown): string {
  const s = typeof input === 'string' ? input.trim() : ''
  if (!s) return ''

  // 不做任何“截断/补全”，返回啥就加载啥；只做最轻量的规范化
  try {
    const u = new URL(s)
    u.pathname = u.pathname.replace(/\/{2,}/g, '/')
    return u.toString()
  } catch {
    return s.replace(/\/{2,}/g, '/')
  }
}

const imageUrl = computed(() => {
  return normalizeChatImageUrl(props.item?.images)
})

const textContent = computed(() => {
  const raw = props.item?.content
  const s = typeof raw === 'string' ? raw.trim() : ''
  if (!s) return ''
  // 图片消息为了会话列表摘要可能会塞一个占位文案，这里在明细里不展示
  if (imageUrl.value && /^\[图片\]$/u.test(s)) return ''
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
              <img
                v-lazyLoad="imageUrl"
                loading="lazy"
                decoding="async"
                data-image-preview="true"
                style="object-fit: contain"
              /> 
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
      min-width: 0;
      display: flex;

      .inner-box {
        max-width: min(5.2rem, 70vw);
        padding: 0.25rem;
        font-size: 0.375rem;
        background: #fff;
        border-radius: 0.2rem;
        position: relative;
        overflow-wrap: anywhere;
        word-break: break-word;

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

.img-box {
  width: min(4.6rem, 62vw);
  height: min(4.6rem, 62vw);
  margin-top: 0.18rem;
  border-radius: 0.2rem;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-box img {
  width: 100%;
  height: 100%;
  display: block;
}

.img-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 0.32rem;
  background: rgba(0, 0, 0, 0.05);
}
.customer-service-avatar {
  width: 1rem;
  height: 1rem;
  overflow: hidden;
  margin: 0 0.3rem;
  flex: 0 0 auto;

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
