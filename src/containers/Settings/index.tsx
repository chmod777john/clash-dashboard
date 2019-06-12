import * as React from 'react'
import { translate } from 'react-i18next'
import { changeLanguage } from 'i18next'
import { inject, observer } from 'mobx-react'
import { Header, Card, Row, Col, Switch, ButtonSelect, ButtonSelectOptions, Input, Icon } from '@components'
import { I18nProps, BaseRouterProps } from '@models'
import { updateConfig } from '@lib/request'
import { to } from '@lib/helper'
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
        isClashX: false
    }

    languageOptions: ButtonSelectOptions[] = [{ label: '中文', value: 'zh' }, { label: 'English', value: 'en' }]

    changeLanguage = (language: string) => {
        changeLanguage(language)
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

    async componentDidMount () {
        await rootStores.store.fetchData()
        if (isClashX()) {
            await rootStores.store.fetchClashXData()
            this.setState({
                isClashX: true
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
            socks5ProxyPort,
            httpProxyPort
        } = this.state

        const {
            hostname: externalControllerHost,
            port: externalControllerPort
        } = store.apiInfo

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
                        <Col span={12}>
                            <Col span={14} offset={1}>
                                <span className="label">{t('labels.startAtLogin')}</span>
                            </Col>
                            <Col span={8} className="value-column">
                                <Switch disabled={!isClashX} checked={startAtLogin} onChange={this.handleStartAtLoginChange} />
                            </Col>
                        </Col>
                        <Col span={12}>
                            <Col span={8} offset={1}>
                                <span className="label">{t('labels.language')}</span>
                            </Col>
                            <Col span={14} className="value-column">
                                <ButtonSelect options={this.languageOptions} value={lng.replace(/-.+$/, '')} onSelect={this.changeLanguage} />
                            </Col>
                        </Col>
                    </Row>
                    <Row gutter={24} align="middle">
                        <Col span={12}>
                            <Col span={14} offset={1}>
                                <span className="label">{t('labels.setAsSystemProxy')}</span>
                            </Col>
                            <Col span={8} className="value-column">
                                <Switch
                                    disabled={!isClashX}
                                    checked={systemProxy}
                                    onChange={this.handleSetSystemProxy}
                                />
                            </Col>
                        </Col>
                        <Col span={12}>
                            <Col span={14} offset={1}>
                                <span className="label">{t('labels.allowConnectFromLan')}</span>
                            </Col>
                            <Col span={8} className="value-column">
                                <Switch
                                    checked={allowLan}
                                    onChange={this.handleAllowLanChange}
                                />
                            </Col>
                        </Col>
                    </Row>
                </Card>

                <Card className="settings-card">
                    <Row gutter={24} align="middle">
                        <Col span={12}>
                            <Col span={8} offset={1}>
                                <span className="label">{t('labels.proxyMode')}</span>
                            </Col>
                            <Col span={14} className="value-column">
                                <ButtonSelect
                                    options={proxyModeOptions}
                                    value={mode}
                                    onSelect={this.handleProxyModeChange}
                                />
                            </Col>
                        </Col>
                        <Col span={12}>
                            <Col span={14} offset={1}>
                                <span className="label">{t('labels.socks5ProxyPort')}</span>
                            </Col>
                            <Col span={8}>
                                <Input
                                    value={socks5ProxyPort}
                                    onChange={socks5ProxyPort => this.setState({ socks5ProxyPort: parseInt(socks5ProxyPort, 10) })}
                                    onBlur={this.handleSocksPortSave}
                                />
                            </Col>
                        </Col>
                    </Row>
                    <Row gutter={24} align="middle">
                        <Col span={12}>
                            <Col span={14} offset={1}>
                                <span className="label">{t('labels.httpProxyPort')}</span>
                            </Col>
                            <Col span={8}>
                                <Input
                                    type="number"
                                    value={httpProxyPort}
                                    onChange={httpProxyPort => this.setState({ httpProxyPort: parseInt(httpProxyPort, 10) })}
                                    onBlur={this.handleHttpPortSave}
                                />
                            </Col>
                        </Col>
                        <Col span={12}>
                            <Col span={12} offset={1}>
                                <span className="label">{t('labels.externalController')}</span>
                            </Col>
                            <Col className="external-controller" span={10}>
                                <span className="modify-btn" onClick={() => this.props.store.setShowAPIModal(true)}>
                                    {`${externalControllerHost}:${externalControllerPort}`}
                                </span>
                            </Col>
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
            </div>
        )
    }
}

export default translate(['Settings'])(Settings)
