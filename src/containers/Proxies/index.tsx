import * as React from 'react'
import { translate } from 'react-i18next'
import { inject, observer } from 'mobx-react'
import { storeKeys } from '@lib/createStore'
import { Header, Icon } from '@components'
import { I18nProps, BaseRouterProps, Proxy as IProxy } from '@models'

import { Proxy, ModifyProxyDialog } from './components'
import './style.scss'

interface ProxiesProps extends BaseRouterProps, I18nProps {}

interface ProxiesState {
    showModifyProxyDialog: boolean
    activeConfig?: IProxy
}

@inject(...storeKeys)
@observer
class Proxies extends React.Component<ProxiesProps, ProxiesState> {

    state = {
        showModifyProxyDialog: false,
        activeConfig: null
    }

    componentDidMount () {
        this.props.config.fetchAndParseConfig()
    }

    render () {
        const { t, config } = this.props
        const { showModifyProxyDialog, activeConfig } = this.state

        return (
            <>
                <div className="page">
                    <div className="proxies-container">
                        <Header title={t('title')} >
                            <Icon type="plus" size={20} style={{ fontWeight: 'bold' }} />
                        </Header>
                        {
                            config.state === 'ok' && <ul className="proxies-list">
                                {
                                    config.config.proxy.map((p, index) => (
                                        <li key={index}>
                                            <Proxy config={p} onEdit={() => this.setState({
                                                showModifyProxyDialog: true,
                                                activeConfig: p
                                            })} />
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                    </div>
                    <div className="proxies-container">
                        <Header title={t('groupTitle')} />
                    </div>

                    {
                        showModifyProxyDialog && <ModifyProxyDialog
                            config={activeConfig}
                            onOk={config => {
                                console.log(config)
                                this.setState({ showModifyProxyDialog: false, activeConfig: null })
                            }}
                            onCancel={() => this.setState({ showModifyProxyDialog: false, activeConfig: null })}
                        />
                    }
                </div>
            </>
        )
    }
}

export default translate(['Proxies'])(Proxies)
