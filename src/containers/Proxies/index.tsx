import * as React from 'react'
import { translate } from 'react-i18next'
import { inject, observer } from 'mobx-react'
import { storeKeys } from '@lib/createStore'
import { Header, Icon } from '@components'
import { I18nProps, BaseRouterProps } from '@models'

import { Proxy } from './components'
import './style.scss'

interface ProxiesProps extends BaseRouterProps, I18nProps {}

@inject(...storeKeys)
@observer
class Proxies extends React.Component<ProxiesProps, {}> {

    componentDidMount () {
        this.props.config.fetchAndParseConfig()
    }

    render () {
        const { t, config } = this.props

        return (
            <div className="page">
                <div className="proxies-container">
                    <Header title={t('title')} >
                        <Icon type="plus" size={20} style={{ fontWeight: 'bold' }} />
                    </Header>
                    {
                        config.state === 'ok' && <ul className="proxies-list">
                            {
                                config.config.proxy.map(
                                    (p, index) => (
                                        <li key={index}>
                                            <Proxy config={p} />
                                        </li>
                                    )
                                )
                            }
                        </ul>
                    }
                </div>
                <div className="proxies-container">
                    <Header title={t('groupTitle')} />
                </div>
            </div>
        )
    }
}

export default translate(['Proxies'])(Proxies)
