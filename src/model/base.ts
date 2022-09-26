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
  last_modified?: Date
  history: History<H>
  extension?: E
}

export interface History<H> {
  last_modified: Date
  extension: H
}

export interface Tag {
  id: number
  alias: string[]
}
