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
    activeConfigIndex?: number
}

@inject(...storeKeys)
@observer
class Proxies extends React.Component<ProxiesProps, ProxiesState> {

    state = {
        showModifyProxyDialog: false,
        activeConfig: null,
        activeConfigIndex: -1
    }

    componentDidMount () {
        this.props.config.fetchAndParseConfig()
    }

    handleConfigApply = async (config: IProxy) => {
        await this.props.config.modifyProxyByIndexAndSave(this.state.activeConfigIndex, config)
        this.setState({ showModifyProxyDialog: false, activeConfig: null })
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
                            config.config.proxy.length !== 0 && <ul className="proxies-list">
                                {
                                    config.config.proxy.map((p, index) => (
                                        <li key={p.name}>
                                            <Proxy config={p} onEdit={() => this.setState({
                                                showModifyProxyDialog: true,
                                                activeConfig: p,
                                                activeConfigIndex: index
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
                </div>

                {
                    showModifyProxyDialog && <ModifyProxyDialog
                        config={activeConfig}
                        onOk={this.handleConfigApply}
                        onCancel={() => this.setState({ showModifyProxyDialog: false, activeConfig: null, activeConfigIndex: -1 })}
                    />
                }
            </>
        )
    }
}

export default translate(['Proxies'])(Proxies)
