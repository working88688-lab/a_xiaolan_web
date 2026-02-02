<template>
  <div :style="{
    width: `${size}rem`,
    height: `${size}rem`
  }" :class="[`featured-avItem-avatar ${props.boxClass}`]" @click.stop="toUserPage">
    <slot>
      <div :class="[`avItem-avatar ${props.avatarClass}`]">
        <img :key="props.img" v-lazyLoad="props.img" :src="loading" />
      </div>
    </slot>

    <img v-if="isCreater" :style="{
      width: `${size * 0.4}rem`,
      height: `${size * 0.4}rem`
    }" :class="[`avItem-chuang ${props.iconClass}`]" src="~/assets/image/creator.png" />

    <slot name="badge"></slot>
  </div>
</template>

<script setup lang="ts">
import loading from '@assets/image/img_loading.png'

const props = withDefaults(
  defineProps<{
    img?: string
    uid?: number
    isCreater?: boolean
    avatarClass?: string
    iconClass?: string
    boxClass?: string
    size?: number
    aff?: string | number
  }>(),
  {
    img: '',
    isCreater: false,
    size: 1, //rem
    boxClass: '',
    avatarClass: '',
    iconClass: '',
    uid: undefined,
    aff: undefined
  }
)

const __ = useNuxtApp()

const toUserPage = () => {
  if (!props.uid) return
  __.$NavigateTo(`/userdetail?id=${props.uid}`)
}
</script>

<style lang="less" scoped>
.featured-avItem-avatar {
  position: relative;
}

.avItem-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;

  img {
    object-fit: cover;
  }
}

.avItem-chuang {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
}
</style>
