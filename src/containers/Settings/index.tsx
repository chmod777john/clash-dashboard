import * as React from 'react'
import { Header, Card, Row, Col, Switch, ButtonSelect, ButtonSelectOptions } from '@components'
import { translate } from 'react-i18next'
import { I18nProps } from '@i18n'
import './style.scss'

class Settings extends React.Component<I18nProps, {}> {

    state = {
        startAtLogin: false,
        language: 'en',
        setAsSystemProxy: true,
        allowConnectFromLan: true
    }

    languageOptions: ButtonSelectOptions[] = [
        { label: '中文', value: 'zh' },
        { label: 'English', value: 'en' }
    ]

    render () {
        const { t } = this.props
        const {
            startAtLogin,
            language,
            setAsSystemProxy,
            allowConnectFromLan
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
            </div>
        )
    }
}

export default translate(['Settings'])(Settings)
