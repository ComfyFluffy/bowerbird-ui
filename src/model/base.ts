// export interface LocalMedia<T> {
//   _id: number
//   url: string
//   size: number
//   mime: string
//   local_path: string
//   extension?: T
// }

// export interface ImageMedia {
//   width: number
//   height: number
//   palette_hsv: Hsv[]
// }

export interface Item<E, H> {
  id: number
  parent_id?: number
  tag_ids?: number[]
  source_id: string
  source_inaccessible: boolean
  inserted_at: string
  updated_at: string
  history: History<H>
  extension: E
}

export interface History<H> {
  inserted_at: string
  extension: H
}

export interface Tag {
  id: number
  alias: string[]
}

export type Source = 'pixiv'

export interface GeneralUser {
  source: Source
  id: number
  name: string
  avatarUrl?: string
  previewUrls?: string[]
}
