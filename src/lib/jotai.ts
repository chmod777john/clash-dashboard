import { produce, type Draft } from 'immer'
import { useMemo } from 'react'

export type WritableDraft<T> = (draft: Draft<T>) => void

export function useWarpImmerSetter<T extends object> (setter: (f: WritableDraft<T>) => void) {
    const set = useMemo(() => {
        function set<K extends keyof Draft<T>> (key: K, value: Draft<T>[K]): void
        function set (data: Partial<T>): void
        function set (f: (draft: Draft<T>) => void | T): void
        function set<K extends keyof Draft<T>> (data: unknown, value?: Draft<T>[K]): void {
            if (typeof data === 'string') {
                setter((draft: Draft<T>) => {
                    const key = data as K
                    const v = value
                    draft[key] = v!
                })
            } else if (typeof data === 'function') {
                const fn = data as (draft: Draft<T>) => void | T
                setter(draft => fn(draft))
            } else if (typeof data === 'object') {
                setter(pre => produce(pre, (draft: Draft<T>) => {
                    const obj = data as Draft<T>
                    for (const key of Object.keys(obj)) {
                        const k = key as keyof Draft<T>
                        draft[k] = obj[k]
                    }
                }))
            }
        }

        return set
    }, [setter])

    return set
}
