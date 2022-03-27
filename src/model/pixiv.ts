export interface PixivUserExt {
  is_followed: boolean
  total_following?: number
  total_illust_series?: number
  total_illusts?: number
  total_manga?: number
  total_novel_series?: number
  total_novels?: number
  total_public_bookmarks?: number
}

export interface PixivUserHistory {
  name: string
  account: string
  is_premium: boolean

  birth?: string
  region?: string
  gender?: string
  comment?: string
  twitter_account?: string
  web_page?: string
  workspace?: Record<string, string>
  workspace_image_url?: string
  background_url?: string
  avatar_url?: string
}

export interface PixivWorksExt {
  total_bookmarks: number
  total_view: number
  is_bookmarked: boolean
}

export interface PixivIllustHistory {
  illust_type: string
  caption_html: string
  title: string
  image_urls: string[]
  date?: Date
  ugoira_delay?: number[]
}

export interface PixivNovelHistory {
  caption_html: string
  title: string
  text: string
  cover_image_url?: string
  image_urls: string[]
  date?: Date
}

import { ImageMedia, Item, LocalMedia } from './base'

export type PixivIllust = Item<PixivWorksExt, PixivIllustHistory>
export type PixivNovel = Item<PixivWorksExt, PixivNovelHistory>
export type PixivUser = Item<PixivUser, PixivUserHistory>
export type PixivImage = LocalMedia<ImageMedia>
