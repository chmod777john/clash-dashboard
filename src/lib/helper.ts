export function getLocalStorageItem (key: string, defaultValue = '') {
    return window.localStorage.getItem(key) || defaultValue
}

export function setLocalStorageItem (key: string, value: string) {
    return window.localStorage.setItem(key, value)
}

export function noop () {}

export function getSearchParam(key: string) {
    return new URLSearchParams(window.location.search).get(key)
}

export function partition<T> (arr: T[], fn: (arg: T) => boolean): [T[], T[]] {
    const left: T[] = []
    const right: T[] = []
    for (const item of arr) {
        fn(item) ? left.push(item) : right.push(item)
    }
    return [left, right]
}
