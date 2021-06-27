export function noop () {}

export function partition<T> (arr: T[], fn: (arg: T) => boolean): [T[], T[]] {
    const left: T[] = []
    const right: T[] = []
    for (const item of arr) {
        fn(item) ? left.push(item) : right.push(item)
    }
    return [left, right]
}
