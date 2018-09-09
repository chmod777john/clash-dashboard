import * as i18n from 'i18next'
import * as LanguageDetector from 'i18next-browser-languagedetector'

const options = {
    fallbackLng: 'en',

    ns: ['slidebar'],
    resources: {
        en: {
            slidebar: {
                Proxies: 'Proxies',
                Overview: 'Overview',
                Logs: 'Logs',
                Rules: 'Rules',
                Setting: 'Setting'
            }
        },
        cn: {
            slidebar: {
                Proxies: '代理',
                Overview: '总览',
                Logs: '日志',
                Rules: '规则',
                Setting: '设置'
            }
        }
    },
    react: {
        wait: true
    }
}

export interface I18nProps {
    t? (key: string): string
}

export default i18n.use(LanguageDetector).init(options)
