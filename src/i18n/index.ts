/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import { getLocalStorageItem, setLocalStorageItem } from '@lib/helper'

import en_US from './en_US'
import zh_CN from './zh_CN'

export const Language = {
    en_US,
    zh_CN
}

export type Lang = keyof typeof Language

const languageKey = 'language'

export const locales = Object.keys(Language)

function getNavigatorLanguage (): string[] {
    const found: string[] = []

    if (window.navigator) {
        if (window.navigator.languages) {
            for (const lan of window.navigator.languages) {
                found.push(lan)
            }
        } else if (window.navigator.language) {
            found.push(navigator.language)
        }
    }

    return found
}

export function getLanguage (): Lang {
    const localLanguage = getLocalStorageItem(languageKey)
    if (localLanguage && locales.includes(localLanguage)) {
        return localLanguage as Lang
    }

    const navigatorLanguage = getNavigatorLanguage()
    for (const language of navigatorLanguage) {
        if (language.includes('zh')) {
            return 'zh_CN'
        } else if (language.includes('us')) {
            return 'en_US'
        }
    }

    return 'en_US'
}

export function setLanguage (lang: Lang) {
    setLocalStorageItem(languageKey, lang)
}
