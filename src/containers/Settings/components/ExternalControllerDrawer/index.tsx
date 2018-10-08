import * as React from 'react'
import { translate } from 'react-i18next'
import { Modal, Input, Row, Col, Alert } from '@components'
import { I18nProps } from '@models'
import './style.scss'

interface ExternalControllerModalProps extends I18nProps {
    show: boolean
    host: string
    port: string
    secret?: string
    onConfirm: (host: string, port: string, secret: string) => void
    onCancel: () => void
}

interface ExternalControllerModalState {
    host: string
    port: string
    secret: string
}

class ExternalController extends React.Component<ExternalControllerModalProps, ExternalControllerModalState> {

    state = {
        host: this.props.host,
        port: this.props.port,
        secret: this.props.secret || ''
    }

    private handleOk = () => {
        const { onConfirm } = this.props
        const { host, port, secret } = this.state
        onConfirm(host, port, secret)
    }

    render () {
        const { show, onCancel, t } = this.props
        const { host, port, secret } = this.state

        return (
            <Modal
                show={show}
                title={t('externalControllerSetting.title')}
                bodyClassName="external-controller"
                onClose={onCancel}
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
                            value={host}
                            onChange={host => this.setState({ host })}
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

export const ExternalControllerModal = translate(['Settings'])(ExternalController)
