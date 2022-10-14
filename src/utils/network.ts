import useSWR from 'swr'
import { Source } from '../model/base'

export const apiBase = '/api/v2/'

/**
 * @param source `source` of the target image to fill in the url.
 * @param path `local_path` of the image.
 * @param size The target size of the image. If none, the original file is returend.
 * @param cropToCenter Whether to crop the image to the center.
 * @returns Absolute url of the image.
 */
export const srcByPath = (
  source: Source,
  path?: string,
  size?: number,
  cropToCenter = true
) =>
  size
    ? `${apiBase}${source}/thumbnail/${path}?${new URLSearchParams({
        size: size.toString(),
        crop_to_center: cropToCenter.toString(),
      })}`
    : `${apiBase}${source}/storage/${path}`

const postFetcher = async <T>(url: string, body: string): Promise<T> => {
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
  if (!r.ok) {
    throw new Error(`${url}: ${r.status}: ${await r.text()}`)
  }
  return JSON.parse(await r.text()) as T
}

export const usePost = <T, B = any>(url: string | null, body: B) =>
  useSWR<T>(url === null ? null : [url, JSON.stringify(body)], postFetcher)

export interface Cursor {
  limit: number
  offset: number
}

export const computeCursor = (page: number, perPage: number): Cursor => ({
  limit: perPage,
  offset: (page - 1) * perPage,
})

export interface ItemsResponse<T> {
  items: T[]
  total: number
}
