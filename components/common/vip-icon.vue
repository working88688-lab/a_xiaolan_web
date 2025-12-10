<script lang="tsx">
import iconAwYueka from '@assets/image/my/vip_aw_month.png'
import iconAwNianka from '@assets/image/my/vip_aw_year.png'
import icon_dark from '@assets/image/my/vip_dark.png'
import iconYueka from '@assets/image/my/vip_month.png'
import iconJika from '@assets/image/my/vip_se.png'
import icon_supreme from '@assets/image/my/vip_supreme.png'
import iconNianka from '@assets/image/my/vip_year.png'
import iconYoingjiu from '@assets/image/my/vip_yongjiu.png'
import type { UserInfo } from '@types'
import type { PropType } from 'vue'
export default defineComponent({
  props: {
    data: {
      type: Object as PropType<UserInfo>,
      default: () => ({})
    }
  },

  render() {
    const map = {
      1: iconYueka,
      2: iconJika,
      3: iconNianka,
      4: iconYoingjiu,
      6: iconAwYueka,
      7: iconAwNianka,
      8: icon_dark,
      9: icon_supreme
    }
    // 设置vip level
    const setVipIcon = (vip: number) => {
      // @ts-ignore
      return map[vip]
    }
    if (this.$props.data.is_vip === 1) {
      return <img class='vip-level' src={setVipIcon(this.$props.data.vip_level)} />
    }
    return null
  }
})
</script>

<style lang="less" scoped>
.vip-level {
  max-width: 60px;
  height: auto;
  object-fit: contain;
}
</style>
