import type { Table } from 'dexie'

import Dexie from 'dexie'

type DbData = any & {
  _userID: string
  _watch_at: number
}

export class HistoryDb extends Dexie {
  game!: Table<DbData>
  video!: Table<DbData>
  original!: Table<DbData>
  collect!: Table<DbData>
  cartoon!: Table<DbData>
  novel!: Table<DbData>
  image!: Table<DbData>
  post!: Table<DbData>
  comic!: Table<DbData>
  constructor() {
    super('HistoryDb')

    this.version(1).stores({
      game: 'id, _userID, _watch_at',
      video: 'id, _userID, _watch_at',
      original: 'id, _userID, _watch_at',
      collect: 'id, _userID, _watch_at',
      cartoon: 'id, _userID, _watch_at',
      novel: 'id, _userID, _watch_at',
      image: 'id, _userID, _watch_at',
      post: 'id, _userID, _watch_at',
      comic: 'id, _userID, _watch_at'
    })
  }
}

export const historyDb = new HistoryDb()
export type Tables = 'game' | 'video' | 'original' | 'collect' | 'cartoon' | 'novel' | 'image' | 'post' | 'comic'
