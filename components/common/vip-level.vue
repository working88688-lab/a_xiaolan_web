<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: Number,
      default: undefined
    }
  },
  setup(props) {
    const vip_level = props.value
    let userType = ''
    if (vip_level == 1) {
      userType = '月卡会员'
    } else if (vip_level == 2) {
      userType = '季卡会员'
    } else if (vip_level == 3) {
      userType = '年卡会员'
    } else if (vip_level == 4) {
      userType = '永久会员'
    } else if (vip_level == 6) {
      userType = '暗网月卡会员'
    } else if (vip_level == 7) {
      userType = '暗网年卡会员'
    } else {
      userType = '普通用户'
    }
    return () => <span style={{ fontSize: '12px' }}>{userType}</span>
  }
})
</script>
