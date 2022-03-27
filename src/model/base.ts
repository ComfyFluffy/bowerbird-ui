import { ObjectId } from 'bson'

export interface LocalMedia<T> {
  _id: ObjectId
  url: string
  size: number
  mime: string
  local_path: string
  extension?: T
}

export interface ImageMedia {
  width: number
  height: number
  palette_hsv: Hsv[]
}

export interface Hsv {
  h: number
  s: number
  v: number
}

export interface Item<E, H> {
  _id: ObjectId
  parent_id?: ObjectId
  tag_ids?: ObjectId[]
  source_id: string
  source_inaccessible: boolean
  last_modified?: Date
  history: History<H>[]
  extension?: E
}

export interface History<H> {
  last_modified: Date
  extension: H
}

export interface Tag {
  _id: ObjectId
  alias: string[]
  protected: boolean
}
