import { useRecoilState, RecoilState } from 'recoil'
import produce, { Draft } from 'immer'
import { useCallback } from 'react'

export function useRecoilObjectWithImmer<T> (value: RecoilState<T>) {
    const [copy, rawSet] = useRecoilState(value)

    function set<K extends keyof Draft<T>> (key: K, value: Draft<T>[K]): void
    function set<K extends keyof Draft<T>> (data: Partial<T>): void
    function set<K extends keyof Draft<T>> (f: (draft: Draft<T>) => void | T): void
    function set<K extends keyof Draft<T>> (data: any, value?: Draft<T>[K]): void {
        if (typeof data === 'string') {
            rawSet(pre => produce(pre, (draft: Draft<T>) => {
                const key = data as K
                const v = value
                draft[key] = v
            }))
        } else if (typeof data === 'function') {
            const fn = data as (draft: Draft<T>) => void | T
            rawSet(pre => produce(pre, fn) as T)
        } else if (typeof data === 'object') {
            rawSet(pre => produce(pre, (draft: Draft<T>) => {
                const obj = data as Draft<T>
                for (const key of Object.keys(obj)) {
                    const k = key as keyof Draft<T>
                    draft[k] = obj[k]
                }
            }))
        }
    }

    return [copy, useCallback(set, [copy])] as [T, typeof set]
}
