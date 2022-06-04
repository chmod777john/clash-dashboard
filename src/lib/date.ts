import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

import { Lang } from '@i18n'

dayjs.extend(relativeTime)

export function fromNow (date: Date, lang: Lang): string {
    const locale = lang === 'en_US' ? 'en' : 'zh-cn'
    return dayjs(date).locale(locale).from(dayjs())
}
