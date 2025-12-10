import type { CommentItem } from '@types'
export function useComment(key = 'commentRef', list = 'listRef') {
  const commentRef = useTemplateRef<HTMLInputElement>(key)
  const listRef = useTemplateRef<any>(list)

  const reply = ref({} as CommentItem)
  const commentValue = ref()
  const onBeforeComment = (_item: CommentItem) => {
    commentRef.value?.focus()
    reply.value = {
      ..._item
    }
  }

  const refresh_comments = () => {
    listRef.value?.refresh_data()
  }

  return {
    onBeforeComment,
    commentValue,
    reply,
    refresh_comments
  }
}
