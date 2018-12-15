export function getLocalStorageItem (key: string, defaultValue = '') {
    return window.localStorage.getItem(key) || defaultValue
}

export function setLocalStorageItem (key: string, value: string) {
    return window.localStorage.setItem(key, value)
}

export function removeLocalStorageItem (key: string) {
    return window.localStorage.removeItem(key)
}

export function randomNumber (min: number, max: number) {
    return (min + Math.random() * (max - min)) >> 0
}

export function sample<T> (arr: T[]) {
    return arr[randomNumber(0, arr.length)]
}

export function noop () {}

/**
 * to return Promise<[T, Error]>
 * @param {Promise<T>} promise
 */
export async function to <T, E = Error> (promise: Promise<T>): Promise<[T, E]> {
    try {
        const ret = await promise
        return [ret, null as E]
    } catch (e) {
        return [null as T, e]
    }
}

export type Partial<T> = { [P in keyof T]?: T[P] }

export function partition<T> (arr: T[], fn: (T) => boolean): [T[], T[]] {
    const left: T[] = []
    const right: T[] = []
    for (const item of arr) {
        fn(item) ? left.push(item) : right.push(item)
    }
    return [left, right]
}
