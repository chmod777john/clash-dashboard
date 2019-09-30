export function createAsyncSingleton<T> (fn: () => Promise<T>): () => Promise<T> {
    let promise: Promise<T> | null = null

    return async function () {
        if (promise) {
            return promise
        }
        promise = fn()
        return promise
            .catch(e => {
                promise = null
                throw e
            })
    }
}
