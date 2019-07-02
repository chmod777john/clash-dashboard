import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Modal } from '@components'
import { getLocalStorageItem, setLocalStorageItem } from '@lib/helper'
import './style.scss'

import {
    BaseComponentProps,
    Proxy as IProxy,
    SsProxyConfigList, VmessProxyConfigList, Socks5ProxyConfigList,
    TagColors,
    ProxyType,
    SsCipher, VmessCipher, pickCipherWithAlias
} from '@models'

import {
    ProxyInputForm,
    ProxySwitch,
    ProxyColorSelector,
    ProxyTypeSelector,
    ProxyPasswordForm,
    ProxyCipherSelector
} from './FormItems'

interface ModifyProxyDialogProps extends BaseComponentProps, WithTranslation {
    config: IProxy
    onOk?: (config: IProxy) => void
    onCancel?: () => void
}

interface ModifyProxyDialogState {
    config: IProxy
    currentColor: string
}

class RawDialog extends React.Component<ModifyProxyDialogProps, ModifyProxyDialogState> {

    constructor (props: ModifyProxyDialogProps) {
        super(props)

        this.state = {
            config: props.config,
            currentColor: getLocalStorageItem(props.config.name)
        }
    }

    componentDidMount () {
        console.log(this.props.config)
    }

    handleOk = () => {
        const { onOk } = this.props
        const { config, currentColor } = this.state
        setLocalStorageItem(config.name, currentColor)

        onOk(config)
    }

    handleConfigChange = (key: string, value: any) => {
        console.log(key, value)
        const { config } = this.state
        this.setState({ config: { ...config, [key]: value } })
    }

    getCipherFromType (type) {
        switch (type) {
        case 'ss':
            return SsCipher
        case 'vmess':
            return VmessCipher
        default:
            return []
        }
    }

    getConfigListFromType (type) {
        switch (type) {
        case 'ss':
            return SsProxyConfigList
        case 'vmess':
            return VmessProxyConfigList
        case 'socks5':
            return Socks5ProxyConfigList
        default:
            return []
        }
    }

    renderFormItem (key) {
        const { t } = this.props
        const { config } = this.state

        switch (key) {
        case 'type':
            return (
                <ProxyTypeSelector
                    key={key}
                    types={ProxyType}
                    label={t('editDialog.type')}
                    value={config.type}
                    onSelect={value => this.handleConfigChange('type', value)}
                />
            )
        case 'name':
            return (
                <ProxyInputForm
                    key={key}
                    label={t('editDialog.name')}
                    value={config.name}
                    onChange={value => this.handleConfigChange('name', value)}
                />
            )
        case 'server':
            return (
                <ProxyInputForm
                    key={key}
                    label={t('editDialog.server')}
                    value={config.server}
                    onChange={value => this.handleConfigChange('server', value)}
                />
            )
        case 'port':
            return (
                <ProxyInputForm
                    key={key}
                    label={t('editDialog.port')}
                    value={config.port ? config.port.toString() : ''}
                    onChange={value => this.handleConfigChange('port', +value)}
                />
            )
        case 'password':
            return (
                <ProxyPasswordForm
                    key={key}
                    label={t('editDialog.password')}
                    value={config.password}
                    onChange={value => this.handleConfigChange('password', value)}
                />
            )
        case 'cipher':
            return (
                <ProxyCipherSelector
                    key={key}
                    ciphers={this.getCipherFromType(config.type)}
                    label={t('editDialog.cipher')}
                    value={pickCipherWithAlias(config.cipher)}
                    onSelect={value => this.handleConfigChange('cipher', value)}
                />
            )
        case 'obfs':
            return (
                <ProxyInputForm
                    key={key}
                    label={t('editDialog.obfs')}
                    value={config.obfs}
                    onChange={value => this.handleConfigChange('obfs', value)}
                />
            )
        case 'obfs-host':
            return (
                <ProxyInputForm
                    key={key}
                    label={t('editDialog.obfs-host')}
                    value={config['obfs-host']}
                    onChange={value => this.handleConfigChange('obfs-host', value)}
                />
            )
        case 'uuid':
            return (
                <ProxyPasswordForm
                    key={key}
                    label={t('editDialog.uuid')}
                    value={config.uuid}
                    onChange={value => this.handleConfigChange('uuid', value)}
                />
            )
        case 'alterId':
            return (
                <ProxyInputForm
                    key={key}
                    label={t('editDialog.alterId')}
                    value={config.alterId ? config.alterId.toString() : ''}
                    onChange={value => this.handleConfigChange('alterId', +value)}
                />
            )
        case 'tls':
            return (
                <ProxySwitch
                    key={key}
                    label={t('editDialog.tls')}
                    value={!!config.tls}
                    onChange={value => this.handleConfigChange('tls', !!value)}
                />
            )
        default:
            return null
        }
    }

    render () {
        const { onCancel, t } = this.props
        const { currentColor, config } = this.state
        const { type } = config
        const configList = this.getConfigListFromType(type)

        return <Modal
            className="proxy-editor"
            title={t('editDialog.title')}
            onOk={this.handleOk}
            onClose={onCancel}
        >
            <ProxyColorSelector
                colors={TagColors}
                value={currentColor}
                onSelect={color => this.setState({ currentColor: color })}
            />
            {
                configList.map(c => this.renderFormItem(c))
            }
        </Modal>
    }
}

export const ModifyProxyDialog = withTranslation(['Proxies'])(RawDialog)
