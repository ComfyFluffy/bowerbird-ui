import useSWR from 'swr'

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

export const usePost = <T>(url: string | null, body: any) =>
  useSWR<T>(url === null ? null : [url, JSON.stringify(body)], postFetcher)
