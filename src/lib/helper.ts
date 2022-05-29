import { floor } from 'lodash-es'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop () {}

export function partition<T> (arr: T[], fn: (arg: T) => boolean): [T[], T[]] {
    const left: T[] = []
    const right: T[] = []
    for (const item of arr) {
        fn(item) ? left.push(item) : right.push(item)
    }
    return [left, right]
}

export function formatTraffic (num: number) {
    const s = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
    const exp = Math.floor(Math.log(num || 1) / Math.log(1024))
    return `${floor(num / Math.pow(1024, exp), 2).toFixed(2)} ${s?.[exp] ?? ''}`
}

export function basePath (path: string) {
    return path.replace(/.*[/\\]/, '')
}
