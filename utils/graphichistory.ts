const keyString = 'Blue_Graphic_History'

export type GraphicHistory = {
  id?: number
  s_id?: number
}
export const onQueryHistory = (id: number, mark = 'comics') => {
  const history = localStorage.getItem(`${keyString}_${mark}`)
  if (!history || history == 'null') {
    return false
  } else {
    const oldhistory = JSON.parse(history) as unknown as GraphicHistory[]
    if (oldhistory.length > 0) {
      const current = oldhistory.filter(item => item.id == id)
      if (current.length > 0) {
        return current[0]
      } else {
        return false
      }
    } else {
      return false
    }
  }
}

function onSetItem(array: GraphicHistory[], mark = 'comics') {
  localStorage.setItem(`${keyString}_${mark}`, JSON.stringify(array))
}

export const onSaveHistory = (object: GraphicHistory, mark = 'comics') => {
  const history = localStorage.getItem(`${keyString}_${mark}`)
  if (!history || history == 'null') {
    const newArray = new Array()
    newArray.push(object)
    onSetItem(newArray, mark)
  } else {
    const oldhistory = JSON.parse(history) as unknown as GraphicHistory[]
    if (oldhistory.length > 0) {
      const current = oldhistory.filter(item => item.id == object.id)
      if (current.length > 0) {
        const newHistory = oldhistory.map(item => {
          if (item.id == object.id) {
            item.s_id = object.s_id
          }
          return item
        })
        onSetItem(newHistory, mark)
      } else {
        const current = [...oldhistory]
        current.push(object)
        onSetItem(current, mark)
      }
    }
  }
}
