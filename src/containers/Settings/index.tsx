import * as React from 'react'
import { translate } from 'react-i18next'
import { changeLanguage } from 'i18next'
import { Header, Card, Row, Col, Switch, ButtonSelect, ButtonSelectOptions, Input, Icon } from '@components'
import { ExternalControllerModal } from './components'
import { I18nProps } from '@models'
import { getConfig, updateConfig } from '@lib/request'
import { getLocalStorageItem, setLocalStorageItem } from '@lib/helper'
import './style.scss'

class Settings extends React.Component<I18nProps, {}> {
    state = {
        startAtLogin: false,
        setAsSystemProxy: true,
        allowConnectFromLan: true,
        proxyMode: 'Rule',
        socks5ProxyPort: 7891,
        httpProxyPort: 7890,
        externalControllerHost: getLocalStorageItem('externalControllerAddr', '127.0.0.1'),
        externalControllerPort: getLocalStorageItem('externalControllerPort', '8080'),
        externalControllerSecret: getLocalStorageItem('secret', ''),
        showEditDrawer: false
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
        try {
            await updateConfig({ mode })
            this.setState({ proxyMode: mode })
        } catch (err) {
            throw err
        }
    }

    handleHttpPortSave = async () => {
        try {
            await updateConfig({
                'redir-port': this.state.httpProxyPort
            })
        } catch (err) {
            throw err
        }
    }

    handleSocksPortSave = async () => {
        try {
            await updateConfig({
                'socket-port': this.state.socks5ProxyPort
            })
        } catch (err) {
            throw err
        }
    }

    handleAllowLanChange = async (state: boolean) => {
        try {
            await updateConfig({
                'allow-lan': state
            })
            this.setState({ allowConnectFromLan: state })
        } catch (err) {
            throw err
        }
    }

    async componentDidMount () {
        try {
            const { data: config } = await getConfig()
            this.setState({
                proxyMode: config.mode,
                httpProxyPort: config['redir-port'],
                socks5ProxyPort: config['socket-port'],
                allowConnectFromLan: config['allow-lan']
            })
        } catch (err) {
            throw err
        }
    }

    render () {
        const { t, lng } = this.props
        const {
            startAtLogin,
            setAsSystemProxy,
            allowConnectFromLan,
            proxyMode,
            socks5ProxyPort,
            httpProxyPort,
            externalControllerHost,
            externalControllerPort,
            externalControllerSecret,
            showEditDrawer
        } = this.state
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
                            <Switch checked={startAtLogin} onChange={startAtLogin => this.setState({ startAtLogin })} />
                        </Col>
                        <Col span={4} offset={1}>
                            <span className="label">{t('labels.language')}</span>
                        </Col>
                        <Col span={7} className="value-column">
                            <ButtonSelect options={this.languageOptions} value={lng} onSelect={this.changeLanguage} />
                        </Col>
                    </Row>
                    <Row gutter={24} align="middle">
                        <Col span={6} offset={1}>
                            <span className="label">{t('labels.setAsSystemProxy')}</span>
                        </Col>
                        <Col span={4} className="value-column">
                            <Switch
                                checked={setAsSystemProxy}
                                onChange={setAsSystemProxy => this.setState({ setAsSystemProxy })}
                            />
                        </Col>
                        <Col span={7} offset={1}>
                            <span className="label">{t('labels.allowConnectFromLan')}</span>
                        </Col>
                        <Col span={4} className="value-column">
                            <Switch
                                checked={allowConnectFromLan}
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
                                value={proxyMode}
                                onSelect={this.handleProxyModeChange}
                            />
                        </Col>
                        <Col span={5} offset={1}>
                            <span className="label">{t('labels.socks5ProxyPort')}</span>
                        </Col>
                        <Col span={3} offset={3}>
                            <Input
                                value={socks5ProxyPort}
                                onChange={socks5ProxyPort => this.setState({ socks5ProxyPort })}
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
                                value={httpProxyPort}
                                onChange={httpProxyPort => this.setState({ httpProxyPort })}
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
