export function createAsyncSingleton<T> (fn: () => Promise<T>): () => Promise<T> {
    let promise: Promise<T> | null = null
    let instance: T | null = null

    async function fetch () {
        if (promise) {
            return promise
        }

        promise = fn()
        return promise
            .then(r => {
                promise = null
                return r
            })
            .catch(e => {
                promise = null
                return e
            })
    }

    return async function () {
        if (instance) {
            return instance
        }

        return fetch()
    }
}
