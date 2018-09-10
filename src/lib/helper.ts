export function getLocalStorageItem (key: string) {
    return window.localStorage.getItem(key)
}

export function setLocalStorageItem (key: string, value: string) {
    return window.localStorage.setItem(key, value)
}

export function removeLocalStorageItem (key: string) {
    return window.localStorage.removeItem(key)
}

/**
 * to return Promise<[T, Error]>
 * @param {Promise<T>} promise
 */
export async function to <T, E = Error> (promise: any): Promise<[T, E]> {
    try {
        const ret = await promise
        return [ret, null as E]
    } catch (e) {
        return [null as T, e]
    }
}
