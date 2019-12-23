import { useState, useCallback } from 'react'
import get from 'lodash/get'
import { getLocalStorageItem, setLocalStorageItem } from '@lib/helper'

import en_US from './en_US'
import zh_CN from './zh_CN'

const Language = {
    en_US,
    zh_CN
}

export type Lang = keyof typeof Language

const languageKey = 'language'

const locales = Object.keys(Language)

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

function getLanguage (): Lang {
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

export function useI18n () {
    const [lang, set] = useState(getLanguage())

    function setLang (lang: Lang) {
        set(lang)
        setLocalStorageItem(languageKey, lang)
    }

    const useTranslation = useCallback(
        function (namespace: string) {
            function t (path: string) {
                return get(Language[lang][namespace], path) as string
            }
            return { t }
        },
        [lang]
    )

    return { lang, locales, setLang, useTranslation }
}
