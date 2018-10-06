import * as React from 'react'
import { translate } from 'react-i18next'
import { Header, Icon } from '@components'
import { ProxyType, I18nProps } from '@models'

import { Proxy } from './components'
import './style.scss'

class Proxies extends React.Component<I18nProps, {}> {
    render () {
        const { t } = this.props
        const proxies: { type: ProxyType, name: string }[] = [
            { type: ProxyType.Shadowsocks, name: 'shadowsocks' },
            { type: ProxyType.Vmess, name: 'vmess' }
        ]

        return (
            <div className="page">
                <div className="proxies-container">
                    <Header title={t('title')} >
                        <Icon type="plus" size={20} style={{ fontWeight: 'bold' }} />
                    </Header>
                    <ul className="proxies-list">
                        {
                            proxies.map(
                                proxy => (
                                    <li>
                                        <Proxy type={proxy.type} name={proxy.name} />
                                    </li>
                                )
                            )
                        }
                    </ul>
                </div>
                <div className="proxies-container">
                    <Header title={t('groupTitle')} />
                </div>
            </div>
        )
    }
}

export default translate(['Proxies'])(Proxies)
