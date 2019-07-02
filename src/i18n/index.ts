import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// locales
import en_US from './en_US'
import zh_CN from './zh_CN'

const options = {
    fallbackLng: 'en_US',

    ns: [
        'SideBar',
        'Settings',
        'Logs'
    ],

    resources: {
        en: en_US,
        zh: zh_CN
    },

    react: {
        wait: true
    }
}

i18n.use(LanguageDetector).init(options)

export default i18n
