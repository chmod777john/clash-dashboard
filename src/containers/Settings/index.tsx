import * as React from 'react'
import { Header, Card, Row, Col, Switch, ButtonSelect, ButtonSelectOptions, Input } from '@components'
import { translate } from 'react-i18next'
import { I18nProps } from '@i18n'
import './style.scss'

class Settings extends React.Component<I18nProps, {}> {

    state = {
        startAtLogin: false,
        language: 'en',
        setAsSystemProxy: true,
        allowConnectFromLan: true,
        proxyMode: 'rule',
        socketProxyPort: 7891,
        httpProxyPort: 7890,
        externalController: '127.0.0.1:7892'
    }

    languageOptions: ButtonSelectOptions[] = [
        { label: '中文', value: 'zh' },
        { label: 'English', value: 'en' }
    ]

    proxyModeOptions: ButtonSelectOptions[] = [
        { label: '全局', value: 'global' },
        { label: '规则', value: 'rule' },
        { label: '直连', value: 'none' }
    ]

    render () {
        const { t } = this.props
        const {
            startAtLogin,
            language,
            setAsSystemProxy,
            allowConnectFromLan,
            proxyMode,
            socketProxyPort,
            httpProxyPort,
            externalController,
        } = this.state

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
                                value={language}
                                onSelect={language => this.setState({ language })}
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
                                options={this.proxyModeOptions}
                                value={proxyMode}
                                onSelect={proxyMode => this.setState({ proxyMode })}
                            />
                        </Col>
                        <Col span={4} offset={1}>
                            <span className="label">{t('labels.socketProxyPort')}</span>
                        </Col>
                        <Col span={3} offset={4}>
                            <Input value={socketProxyPort} onChange={socketProxyPort => this.setState({socketProxyPort})}></Input>
                        </Col>
                    </Row>
                    <Row gutter={24} align="middle">
                        <Col span={4} offset={1}>
                            <span className="label">{t('labels.httpProxyPort')}</span>
                        </Col>
                        <Col span={3} offset={3}>
                            <Input value={httpProxyPort} onChange={httpProxyPort => this.setState({httpProxyPort})}></Input>
                        </Col>
                        <Col span={4} offset={1}>
                            <span className="label">{t('labels.externalController')}</span>
                        </Col>
                        <Col span={5} offset={2}>
                            <Input value={externalController} ></Input>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default translate(['Settings'])(Settings)
