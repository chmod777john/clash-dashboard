import { IsEqual } from 'type-fest'

import { Infer } from '@lib/type'

import en_US from './en_US'
import zh_CN from './zh_CN'

export const Language = {
    en_US,
    zh_CN,
}

export type Lang = keyof typeof Language

type US = typeof Language.en_US
type CN = typeof Language.zh_CN

// type guard for US and CN
type TrueGuard<T extends true> = T
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _equalGuard = TrueGuard<IsEqual<Infer<US>, Infer<CN>>>

export type LocalizedType = US

export const locales = Object.keys(Language)

export function getDefaultLanguage (): Lang {
    for (const language of window.navigator.languages) {
        if (language.includes('zh')) {
            return 'zh_CN'
        } else if (language.includes('us')) {
            return 'en_US'
        }
    }

    return 'en_US'
}
