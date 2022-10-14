import { PixivIllust, PixivUser } from '../model/pixiv'
import {
  apiBase,
  computeCursor,
  Cursor,
  ItemsResponse,
  srcByPath,
  usePost,
} from './network'
import { PartialNull, PartialNullUndefinded } from './etc'
import { GeneralUser } from '../model/base'

export const pixivBase = apiBase + 'pixiv/'

export type PixivIllustFindOptions = PartialNullUndefinded<{
  ids: number[]
  parent_ids: number[]
  tag_ids: number[]
  tag_ids_exclude: number[]
  search: string
  bookmark_range: PartialNull<[number, number]>
}>

/**
 *
 * @param options Options to send as JSON.
 * @param page Page count, start from 1.
 * @param perPage Items per page.
 * @returns useSWR result
 */
export const usePixivIllustFind = (
  options?: PixivIllustFindOptions,
  page = 1,
  perPage = 50
) => {
  return usePost<ItemsResponse<PixivIllust>, PixivIllustFindOptions & Cursor>(
    options ? pixivBase + 'illust/find' : null,
    {
      ...options,
      ...computeCursor(page, perPage),
    }
  )
}

export type PixivUserFindOptions = PartialNullUndefinded<{
  ids: number[]
  search: string
}>
export const usePixivUserFind = (
  options?: PixivUserFindOptions,
  page = 1,
  perPage = 30
) => {
  return usePost<ItemsResponse<PixivUser>, PixivUserFindOptions & Cursor>(
    options ? pixivBase + 'user/find' : null,
    {
      ...options,
      ...computeCursor(page, perPage),
    }
  )
}

export const usePixivGeneralUser = (
  id?: number
): {
  data?: GeneralUser
  error: any
} => {
  const { data: userData, error: userError } = usePixivUserFind(
    id === undefined
      ? undefined
      : {
          ids: [id],
        },
    1,
    1
  )
  const { data, error } = usePixivIllustFind(
    userData && userData.items[0] && { parent_ids: [userData.items[0].id] },
    1,
    3
  )
  if (userError) {
    return { error: userError }
  }

  const h = userData?.items[0].history.extension
  return {
    data: data &&
      h && {
        id: id!,
        name: h.name,
        source: 'pixiv',
        avatarUrl: srcByPath('pixiv', h.avatar_path),
        previewUrls: data.items.map((i) =>
          srcByPath('pixiv', i.history.extension.image_paths?.[0], 256)
        ),
      },
    error,
  }
}
