import * as React from 'react'
import { withTranslation } from 'react-i18next'
import { inject, observer } from 'mobx-react'
import { storeKeys } from '@lib/createStore'
import { Modal, Input, Row, Col, Alert } from '@components'
import { BaseProps, I18nProps } from '@models'
import './style.scss'

interface ExternalControllerModalProps extends I18nProps, BaseProps {}

interface ExternalControllerModalState {
    hostname: string
    port: string
    secret: string
}

@inject(...storeKeys)
@observer
class ExternalController extends React.Component<ExternalControllerModalProps, ExternalControllerModalState> {

    state = {
        hostname: '',
        port: '',
        secret: ''
    }

    private handleOk = () => {
        const { hostname, port, secret } = this.state
        this.props.store.updateAPIInfo({ hostname, port, secret })
    }

    private handleCancel = () => {
        this.props.store.setShowAPIModal(false)
    }

    async componentWillMount () {
        await this.props.store.fetchAPIInfo()
        const info = this.props.store.apiInfo
        this.setState({ hostname: info.hostname, port: info.port, secret: info.secret })
    }

    render () {
        const { t } = this.props
        const { hostname, port, secret } = this.state
        const show = this.props.store.showAPIModal

        return (
            <Modal
                show={show}
                title={t('externalControllerSetting.title')}
                bodyClassName="external-controller"
                onClose={this.handleCancel}
                onOk={this.handleOk}
            >
                <Alert type="info" inside={true}>
                    <p>{t('externalControllerSetting.note')}</p>
                </Alert>
                <Row gutter={24} align="middle">
                    <Col span={4} className="title">{t('externalControllerSetting.host')}</Col>
                    <Col span={20} className="form">
                        <Input
                            align="left"
                            inside={true}
                            value={hostname}
                            onChange={hostname => this.setState({ hostname })}
                        />
                    </Col>
                </Row>
                <Row gutter={24} align="middle">
                    <Col span={4} className="title">{t('externalControllerSetting.port')}</Col>
                    <Col span={20} className="form">
                        <Input
                            align="left"
                            inside={true}
                            value={port}
                            onChange={port => this.setState({ port })}
                        />
                    </Col>
                </Row>
                <Row gutter={24} align="middle">
                    <Col span={4} className="title">{t('externalControllerSetting.secret')}</Col>
                    <Col span={20} className="form">
                        <Input
                            align="left"
                            inside={true}
                            value={secret}
                            onChange={secret => this.setState({ secret })}
                        />
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default withTranslation(['Settings'])(ExternalController)
