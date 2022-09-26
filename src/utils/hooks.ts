import { useEffect, useState } from 'react'

type ScrollElement =
  | {
      addEventListener: Element['addEventListener']
      removeEventListener: Element['removeEventListener']
      scrollY?: number
      scrollTop?: number
    }
  | null
  | undefined

export const useOnTop = (e: () => ScrollElement): boolean => {
  const [onTop, setOnTop] = useState(true)

  useEffect(() => {
    const el = e()
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
