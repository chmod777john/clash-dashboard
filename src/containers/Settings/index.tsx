import * as React from 'react'
import { Header, Card, Row, Col, Switch, ButtonSelect, ButtonSelectOptions, Input, Icon } from '@components'
import { translate } from 'react-i18next'
import { changeLanguage } from 'i18next'
import { I18nProps } from '@i18n'
import './style.scss'

class Settings extends React.Component<I18nProps, {}> {

    state = {
        startAtLogin: false,
        setAsSystemProxy: true,
        allowConnectFromLan: true,
        proxyMode: 'Rule',
        socks5ProxyPort: 7891,
        httpProxyPort: 7890,
        externalController: '127.0.0.1:7892'
    }

    languageOptions: ButtonSelectOptions[] = [
        { label: '中文', value: 'zh' },
        { label: 'English', value: 'en' }
    ]

    changeLanguage = (language: string) => {
        changeLanguage(language)
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
            externalController
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
                            <Switch
                                checked={startAtLogin}
                                onChange={startAtLogin => this.setState({ startAtLogin })}
                            />
                        </Col>
                        <Col span={4} offset={1}>
                            <span className="label">{t('labels.language')}</span>
                        </Col>
                        <Col span={7} className="value-column">
                            <ButtonSelect
                                options={this.languageOptions}
                                value={lng}
                                onSelect={this.changeLanguage}
                            />
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
                                onChange={allowConnectFromLan => this.setState({ allowConnectFromLan })}
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
                                onSelect={proxyMode => this.setState({ proxyMode })}
                            />
                        </Col>
                        <Col span={5} offset={1}>
                            <span className="label">{t('labels.socks5ProxyPort')}</span>
                        </Col>
                        <Col span={3} offset={3}>
                            <Input value={socks5ProxyPort} onChange={socks5ProxyPort => this.setState({ socks5ProxyPort })}></Input>
                        </Col>
                    </Row>
                    <Row gutter={24} align="middle">
                        <Col span={5} offset={1}>
                            <span className="label">{t('labels.httpProxyPort')}</span>
                        </Col>
                        <Col span={3} offset={2}>
                            <Input value={httpProxyPort} onChange={httpProxyPort => this.setState({ httpProxyPort })}></Input>
                        </Col>
                        <Col span={5} offset={1}>
                            <span className="label">{t('labels.externalController')}</span>
                        </Col>
                        <Col span={5} offset={1}>
                            <Input value={externalController} ></Input>
                        </Col>
                    </Row>
                </Card>

                <Card className="clash-version" style={{ display: 'none' }}>
                    <span className="check-icon">
                        <Icon type="check" size={20}/>
                    </span>
                    <p className="version-info">{t('versionString', { version: 'unknown' })}</p>
                    <span className="check-update-btn">{t('checkUpdate')}</span>
                </Card>
            </div>
        )
    }
}

export default translate(['Settings'])(Settings)
