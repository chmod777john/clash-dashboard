import * as React from 'react'
import { translate } from 'react-i18next'
import { changeLanguage } from 'i18next'
import { inject, observer } from 'mobx-react'
import { Header, Card, Row, Col, Switch, ButtonSelect, ButtonSelectOptions, Input, Icon } from '@components'
import { ExternalControllerModal } from './components'
import { I18nProps, BaseRouterProps } from '@models'
import { updateConfig } from '@lib/request'
import { setLocalStorageItem, to } from '@lib/helper'
import { rootStores, storeKeys } from '@lib/createStore'
import './style.scss'
import { isClashX, jsBridge } from '@lib/jsBridge'

interface SettingProps extends BaseRouterProps, I18nProps {}

@inject(...storeKeys)
@observer
class Settings extends React.Component<SettingProps, {}> {
    state = {
        socks5ProxyPort: 7891,
        httpProxyPort: 7890,
        externalControllerHost: '127.0.0.1',
        externalControllerPort: '8080',
        externalControllerSecret: '',
        showEditDrawer: false,
        isClashX: false
    }

    languageOptions: ButtonSelectOptions[] = [{ label: '中文', value: 'zh' }, { label: 'English', value: 'en' }]

    changeLanguage = (language: string) => {
        changeLanguage(language)
    }

    handleExternalControllerChange = (host: string, port: string, secret: string) => {
        setLocalStorageItem('externalControllerAddr', host)
        setLocalStorageItem('externalControllerPort', port)
        setLocalStorageItem('secret', secret)
        this.setState({
            showEditDrawer: false,
            externalControllerHost: host,
            externalControllerPort: port,
            externalControllerSecret: secret
        })
    }

    handleProxyModeChange = async (mode: string) => {
        const [, err] = await to(updateConfig({ mode }))
        if (!err) {
            rootStores.store.fetchData()
        }
    }

    handleHttpPortSave = async () => {
        const [, err] = await to(updateConfig({ 'port': this.state.httpProxyPort }))
        if (!err) {
            await this.props.store.fetchData()
            this.setState({ httpProxyPort: this.props.store.data.general.port })
        }
    }

    handleSocksPortSave = async () => {
        const [, err] = await to(updateConfig({ 'socks-port': this.state.socks5ProxyPort }))
        if (!err) {
            await this.props.store.fetchData()
            this.setState({ socks5ProxyPort: this.props.store.data.general.socksPort })
        }
    }

    handleAllowLanChange = async (state: boolean) => {
        const [, err] = await to(updateConfig({ 'allow-lan': state }))
        if (!err) {
            await this.props.store.fetchData()
        }
    }

    handleStartAtLoginChange = async (state: boolean) => {
        await jsBridge.setStartAtLogin(state)
        this.setState({ startAtLogin: state })
    }

    handleSetSystemProxy = async (state: boolean) => {
        await jsBridge.setSystemProxy(state)
        this.setState({ setAsSystemProxy: state })
    }

    async componentWillMount () {
        await rootStores.store.fetchData()
        if (isClashX()) {
            await rootStores.store.fetchClashXData()
            const apiInfo = await jsBridge.getAPIInfo()
            this.setState({
                isClashX: true,
                externalControllerHost: apiInfo.host,
                externalControllerPort: apiInfo.port,
                externalControllerSecret: apiInfo.secret
            })
        }

        const general = this.props.store.data.general
        this.setState({
            socks5ProxyPort: general.socksPort,
            httpProxyPort: general.port
        })
    }

    render () {
        const { t, lng, store } = this.props
        const {
            isClashX,
            externalControllerHost,
            externalControllerPort,
            externalControllerSecret,
            showEditDrawer,
            socks5ProxyPort,
            httpProxyPort
        } = this.state

        const { allowLan, mode } = store.data.general
        const {
            startAtLogin,
            systemProxy
        } = store.clashxData
        const proxyModeOptions: ButtonSelectOptions[] = [
            { label: t('values.global'), value: 'Global' },
            { label: t('values.rules'), value: 'Rule' },
            { label: t('values.direct'), value: 'Direct' }
        ]

        return (
            <div className="page">
                <Header title={t('title')} />
                <Card className="settings-card">
                    <Row gutter={24} align="middle">
                        <Col span={6} offset={1}>
                            <span className="label">{t('labels.startAtLogin')}</span>
                        </Col>
                        <Col span={4} className="value-column">
                            <Switch disabled={!isClashX} checked={startAtLogin} onChange={this.handleStartAtLoginChange} />
                        </Col>
                        <Col span={4} offset={1}>
                            <span className="label">{t('labels.language')}</span>
                        </Col>
                        <Col span={7} className="value-column">
                            <ButtonSelect options={this.languageOptions} value={lng.replace(/-.+$/, '')} onSelect={this.changeLanguage} />
                        </Col>
                    </Row>
                    <Row gutter={24} align="middle">
                        <Col span={6} offset={1}>
                            <span className="label">{t('labels.setAsSystemProxy')}</span>
                        </Col>
                        <Col span={4} className="value-column">
                            <Switch
                                disabled={!isClashX}
                                checked={systemProxy}
                                onChange={this.handleSetSystemProxy}
                            />
                        </Col>
                        <Col span={7} offset={1}>
                            <span className="label">{t('labels.allowConnectFromLan')}</span>
                        </Col>
                        <Col span={4} className="value-column">
                            <Switch
                                checked={allowLan}
                                onChange={this.handleAllowLanChange}
                            />
                        </Col>
                    </Row>
                </Card>

                <Card className="settings-card">
                    <Row gutter={24} align="middle">
                        <Col span={3} offset={1}>
                            <span className="label">{t('labels.proxyMode')}</span>
                        </Col>
                        <Col span={7} className="value-column">
                            <ButtonSelect
                                options={proxyModeOptions}
                                value={mode}
                                onSelect={this.handleProxyModeChange}
                            />
                        </Col>
                        <Col span={5} offset={1}>
                            <span className="label">{t('labels.socks5ProxyPort')}</span>
                        </Col>
                        <Col span={3} offset={3}>
                            <Input
                                value={socks5ProxyPort}
                                onChange={socks5ProxyPort => this.setState({ socks5ProxyPort: parseInt(socks5ProxyPort, 10) })}
                                onBlur={this.handleSocksPortSave}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24} align="middle">
                        <Col span={5} offset={1}>
                            <span className="label">{t('labels.httpProxyPort')}</span>
                        </Col>
                        <Col span={3} offset={2}>
                            <Input
                                type="number"
                                value={httpProxyPort}
                                onChange={httpProxyPort => this.setState({ httpProxyPort: parseInt(httpProxyPort, 10) })}
                                onBlur={this.handleHttpPortSave}
                            />
                        </Col>
                        <Col span={4} offset={1}>
                            <span className="label">{t('labels.externalController')}</span>
                        </Col>
                        <Col className="external-controller" span={6} offset={1}>
                            <span>{`${externalControllerHost}:${externalControllerPort}`}</span>
                            <span className="modify-btn" onClick={() => this.setState({ showEditDrawer: true })}>
                                修改
                            </span>
                        </Col>
                    </Row>
                </Card>

                <Card className="clash-version" style={{ display: 'none' }}>
                    <span className="check-icon">
                        <Icon type="check" size={20} />
                    </span>
                    <p className="version-info">{t('versionString', { version: 'unknown' })}</p>
                    <span className="check-update-btn">{t('checkUpdate')}</span>
                </Card>

                <ExternalControllerModal
                    show={showEditDrawer}
                    host={externalControllerHost}
                    port={externalControllerPort}
                    secret={externalControllerSecret}
                    onConfirm={this.handleExternalControllerChange}
                    onCancel={() => this.setState({ showEditDrawer: false })}
                />
            </div>
        )
    }
}

export default translate(['Settings'])(Settings)
