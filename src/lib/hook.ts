import { Draft } from 'immer'
import { useImmer } from 'use-immer'
import { createContainer } from 'unstated-next'

export function useObject<T extends object> (initialValue: T) {
    let [copy, set] = useImmer(initialValue)

    function setSingle<K extends keyof Draft<T>> (key: K, value: Draft<T>[K]) {
        set(draft => {
            draft[key] = value
        })
    }

    function setMulti<K extends keyof Draft<T>, U extends keyof T> (newValue: Partial<T>) {
        set((draft: Draft<T>) => {
            for (const key of Object.keys(newValue)) {
                draft[key as K] = newValue[key as U] as any
            }
        })
    }

    return { value: copy, setSingle, setMulti, set }
}

type containerFn<Value, State = void> = (initialState?: State) => Value

export function composeContainer<T, C = containerFn<T>, U = { [key: string]: C }> (mapping: U) {
    function Global () {
        return Object.keys(mapping).reduce((obj, key) => {
            obj[key] = mapping[key]()
            return obj
        }, {}) as { [K in keyof U]: T }
    }

    const allContainer = createContainer(Global)
    return {
        Provider: allContainer.Provider,
        containers: Object.keys(mapping).reduce((obj, key) => {
            obj[key] = function () {
                return allContainer.useContainer()[key]
            }
            return obj
        }, {}) as { [K in keyof U]: U[K] }
    }
}
