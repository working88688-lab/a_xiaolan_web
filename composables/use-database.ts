export function useDb(table: Tables, data = {} as any) {
  const { u } = useUserStore()
  historyDb.transaction('rw', historyDb[table], async () => {
    try {
      await historyDb[table]
        .where({
          id: data.id,
          _userID: u.uid
        })
        .delete()
      historyDb[table].add({
        ...data,
        _userID: u.uid,
        _watch_at: Date.now()
      })
    } catch (error) {
      console.log('error: ', error)
    }
  })
}
