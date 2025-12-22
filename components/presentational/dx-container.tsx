import type { FunctionalComponent } from 'vue'

type FComponentProps = {
  loading?: boolean
}

const DxContainer: FunctionalComponent<FComponentProps> = (props, { slots }) => {
  return <div class='container'>{props.loading ? <dx-loading tips='数据加载中'></dx-loading> : slots.default?.()}</div>
}

DxContainer.props = {
  loading: {
    type: Boolean,
    required: false
  }
}

export default DxContainer
