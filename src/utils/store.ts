import { create } from 'zustand'

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
  persist(
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
    })),
    {
      name: 'zoom',
    }
  )
)

export interface CollectionStore {
  collections: Record<string, number[]>
  current: string | null
  setCurrent: (name: string | null) => void
  updateCollection: (name: string, ids: number[]) => void
  removeCollection: (name: string) => void
}

export const useCollectionStore = create<CollectionStore>()(
  persist(
    immer((set) => ({
      collections: {
        Default: [],
      },
      current: null,
      setCurrent: (name) =>
        set((state) => {
          state.current = name
        }),
      updateCollection: (name, ids) =>
        set((state) => {
          state.collections[name] = ids
        }),
      removeCollection: (id) =>
        set((state) => {
          delete state.collections[id]
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

export interface UiStore {
  toolbarType: 'zoom' | 'upload' | null
  setToolbarType: (type: UiStore['toolbarType']) => void
}

// TODO: toolbar for each page

export const useUiStore = create<UiStore>()(
  immer((set) => ({
    toolbarType: null,
    setToolbarType: (type) =>
      set((state) => {
        state.toolbarType = type
      }),
  }))
)
