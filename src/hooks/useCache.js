import { useRef } from 'react'

export default function useCache() {
  const cacheRef = useRef(null)
  const update = data => {
    cacheRef.current = { ...cacheRef.current, ...data }
  }
  const get = () => cacheRef.current
  const clear = () => {
    cacheRef.current = null
  }
  return { update, clear, get, value: cacheRef.current }
}
