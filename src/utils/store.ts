import create from 'zustand'

import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

const defaultZoom = { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }
export interface ZoomStore {
  zoomLevel: number
  zoomIn: () => void
  zoomOut: () => void
  zoomBreakpoints: typeof defaultZoom
}

const computeZoom = (zoomLevel: number) => {
  const zoom: any = {}
  let i = 0
  for (const k in defaultZoom) {
    zoom[k] =
      defaultZoom[k as keyof typeof defaultZoom] + zoomLevel * (i > 2 ? 2 : 1)
    i++
  }
  return zoom as typeof defaultZoom
}

export const useZoomStore = create<ZoomStore>()(
  immer((set) => ({
    zoomLevel: 0,
    zoomBreakpoints: defaultZoom,
    zoomIn: () =>
      set((state) => {
        state.zoomLevel -= 1
        state.zoomBreakpoints = computeZoom(state.zoomLevel)
      }),
    zoomOut: () =>
      set((state) => {
        state.zoomLevel += 1
        state.zoomBreakpoints = computeZoom(state.zoomLevel)
      }),
  }))
)

export interface Collection {
  id: number
  name: string
  items: number[]
}

export interface CollectionStore {
  collections: Collection[]
  current: number | null
  setCurrent: (id: number | null) => void
  addCollection: (name: string) => void
  removeCollection: (id: number) => void
  addCollectionItem: (id: number, item: number) => void
  removeCollectionItem: (id: number, item: number) => void
}

export const useCollectionStore = create<CollectionStore>()(
  persist(
    immer((set) => ({
      collections: [
        {
          id: 1,
          name: 'Default',
          items: [],
        },
      ],
      current: null,
      setCurrent: (id: number | null) => set((state) => (state.current = id)),
      addCollection: (name) =>
        set((state) => {
          state.collections.push({
            id: state.collections.length,
            name,
            items: [],
          })
        }),
      removeCollection: (id) =>
        set((state) => {
          delete state.collections[id]
        }),
      addCollectionItem: (id, item) =>
        set((state) => {
          const collection = state.collections.find((c) => c.id === id)
          if (collection) {
            collection.items.push(item)
          }
        }),
      removeCollectionItem: (id, item) =>
        set((state) => {
          const collection = state.collections.find((c) => c.id === id)
          if (collection) {
            collection.items = collection.items.filter((i) => i !== item)
          }
        }),
    })),
    {
      name: 'collection',
    }
  )
)

export interface RatingStore {
  ratingById: Record<number, number>
  setRating: (id: number, rating: number | null) => void
}

export const useRatingStore = create<RatingStore>()(
  persist(
    immer((set) => ({
      ratingById: {},
      setRating: (id: number, rating: number | null) =>
        set((state) => {
          rating === null
            ? delete state.ratingById[id]
            : (state.ratingById[id] = rating)
        }),
    })),
    {
      name: 'rating',
    }
  )
)
