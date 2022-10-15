import { useEffect, useState } from 'react'
import { UiStore, useUiStore } from './store'

type ScrollElement =
  | ({
      scrollY?: number
      scrollTop?: number
    } & Pick<Element, 'addEventListener' | 'removeEventListener'>)
  | null
  | undefined

/**
 *
 * @param element A function returning the element to listen to scroll event.
 * @returns Whether the element is scrolled to the bottom.
 */
export const useOnTop = (element: () => ScrollElement): boolean => {
  const [onTop, setOnTop] = useState(true)

  useEffect(() => {
    const el = element()
    if (!el) {
      console.log('useOnTop', el)
      return
    }

    const onScroll = () => {
      if (
        (el.scrollY !== undefined && el.scrollY < 10) ||
        (el.scrollTop !== undefined && el.scrollTop < 10)
      ) {
        if (!onTop) {
          setOnTop(true)
        }
      } else {
        if (onTop) {
          setOnTop(false)
        }
      }
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [onTop])
  return onTop
}

export const useToolbarType = (type: UiStore['toolbarType']) => {
  const setToolbarType = useUiStore((s) => s.setToolbarType)

  useEffect(() => {
    setToolbarType(type)

    return () => {
      setToolbarType(null)
    }
  }, [])
}
