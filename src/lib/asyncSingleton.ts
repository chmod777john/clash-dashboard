export function createAsyncSingleton<T> (fn: () => Promise<T>): () => Promise<T> {
    let promise: Promise<T> | null = null

    return async function () {
        if (promise != null) {
            return await promise
        }
        promise = fn()
        return await promise
            .catch(e => {
                promise = null
                throw e
            })
    }
}
