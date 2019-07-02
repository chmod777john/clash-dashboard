import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { inject, observer } from 'mobx-react'
import { storeKeys } from '@lib/createStore'
import EE from '@lib/event'
import { Card, Header, Icon } from '@components'
import { BaseRouterProps } from '@models'

import { Proxy, Group } from './components'
import './style.scss'

interface ProxiesProps extends BaseRouterProps, WithTranslation {}

interface ProxiesState {
}

@inject(...storeKeys)
@observer
class Proxies extends React.Component<ProxiesProps, ProxiesState> {
    componentDidMount () {
        this.props.store.fetchData()
    }

    handleNotitySpeedTest = () => {
        EE.notifySpeedTest()
    }

    render () {
        const { t, store } = this.props

        return (
            <div className="page">
                <div className="proxies-container">
                    <Header title={t('groupTitle')} />
                    <Card className="proxies-group-card">
                        <ul className="proxies-group-list">
                            {
                                store.data.proxyGroup.map(p => (
                                    <li className="proxies-group-item" key={p.name}>
                                        <Group config={p} />
                                    </li>
                                ))
                            }
                        </ul>
                    </Card>
                </div>
                <div className="proxies-container">
                    <Header title={t('title')}>
                        <Icon type="speed" size={20} />
                        <span className="proxies-speed-test" onClick={this.handleNotitySpeedTest}>{t('speedTestText')}</span>
                    </Header>
                    <ul className="proxies-list">
                        {
                            store.data.proxy.map(p => (
                                <li key={p.name}>
                                    <Proxy config={p} />
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default withTranslation(['Proxies'])(Proxies)
