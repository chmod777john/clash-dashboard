import { Draft } from 'immer'
import { useImmer } from 'use-immer'

export function useObject<T extends object> (initialValue: T) {
    let [copy, setCopy] = useImmer(initialValue)

    function change<K extends keyof Draft<T>> (key: K, value: Draft<T>[K]) {
        setCopy(draft => {
            draft[key] = value
        })
    }

    function set<K extends keyof Draft<T>, U extends keyof T> (newValue: T) {
        setCopy((draft: Draft<T>) => {
            (draft as any).isTemplate = true
            for (const key of Object.keys(newValue)) {
                draft[key as K] = newValue[key as U] as any
            }
        })
    }
    return { value: copy, change, set }
}
