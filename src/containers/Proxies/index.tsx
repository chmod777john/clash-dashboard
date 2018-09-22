import * as React from 'react'
import { Header, Icon, Proxy } from '@components'
import { ProxyType } from '@models'
import './style.scss'

export default class Proxies extends React.Component<{}, {}> {
    render () {
        const proxies: { type: ProxyType, name: string }[] = [
            { type: ProxyType.Shadowsocks, name: 'shadowsocks' },
            { type: ProxyType.Vmess, name: 'vmess' }
        ]

        return <div className="proxies-container">
            <Header title="代理" >
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
    }
}
