import * as i18n from 'i18next'
import * as LanguageDetector from 'i18next-browser-languagedetector'

// locales
import en_US from './en_US'
import zh_CN from './zh_CN'

const options = {
    fallbackLng: 'en_US',

    ns: [
        'SideBar',
        'Settings'
    ],

    resources: {
        en: en_US,
        zh: zh_CN
    },

    react: {
        wait: true
    }
}

export interface I18nProps {
    t? (key: string): string
}

export default i18n.use(LanguageDetector).init(options)
