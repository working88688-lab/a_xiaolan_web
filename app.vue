<script setup>
const { config } = useGlobalStore()
useSeoMeta({
  title: config.seo_title || '小藍視頻',
  description:
    config.seo_description ||
    '小藍視頻,小蓝视频,男男做爱,男男a片,男男性爱,男男色情,男男av,gay,gay做爱,gay片,gay视频,gay色情片,gay成人片,色0,bl色情,男同做爱,男生自慰,父子乱伦,精牛,肌肉男,彩虹旗,blued,无需翻墙的男同社區APP，千萬哥哥們的交心軟件！性爱虐恋 剧情影视 激情钙片 同城交友 同志 猛男 小鲜肉 军警 制服  大骚鸡 这里应有尽有！更多精彩尽在小蓝片！。下载小蓝片app安卓及IOS版本，请认准小蓝片官网！',
  ogTitle: '小蓝视频',
  ogDescription:
    '小藍視頻,小蓝视频,男男做爱,男男a片,男男性爱,男男色情,男男av,gay,gay做爱,gay片,gay视频,gay色情片,gay成人片,色0,bl色情,男同做爱,男生自慰,父子乱伦,精牛,肌肉男,彩虹旗,blued,无需翻墙的男同社區APP，千萬哥哥們的交心軟件！性爱虐恋 剧情影视 激情钙片 同城交友 同志 猛男 小鲜肉 军警 制服  大骚鸡 这里应有尽有！更多精彩尽在小蓝片！。下载小蓝片app安卓及IOS版本，请认准小蓝片官网！',
  ogImage: '/favicon.png',
  ogUrl: location.href,
  twitterTitle: '小蓝视频',
  twitterDescription:
    '小藍視頻,小蓝视频,男男做爱,男男a片,男男性爱,男男色情,男男av,gay,gay做爱,gay片,gay视频,gay色情片,gay成人片,色0,bl色情,男同做爱,男生自慰,父子乱伦,精牛,肌肉男,彩虹旗,blued,无需翻墙的男同社區APP，千萬哥哥們的交心軟件！性爱虐恋 剧情影视 激情钙片 同城交友 同志 猛男 小鲜肉 军警 制服  大骚鸡 这里应有尽有！更多精彩尽在小蓝片！。下载小蓝片app安卓及IOS版本，请认准小蓝片官网！',
  twitterImage: '/favicon.png',
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    {
      name: 'keywords',
      content: config.seo_keywords || '小藍視頻'
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
})
/**
 * 当前实例
 */
const historyStore = useHistoryStore()

const keepalive = computed(() => {
  return {
    include: [...historyStore.keepalive],
    max: 50
  }
})
</script>

<template>
  <Html>
    <Body>
      <NuxtLayout>
        <NuxtLoadingIndicator />
        <NuxtPwaManifest />
        <NuxtPage :page-key="route => route.name" :keepalive="keepalive" />
      </NuxtLayout>
    </Body>
  </Html>
</template>
