import * as React from 'react'
import { Modal, Input, Row, Col, Alert } from '@components'
import './style.scss'

interface ExternalControllerDrawerProps {
    show: boolean
    host: string
    port: string
    onConfirm: (host: string, port: string) => void
    onCancel: () => void
}

interface ExternalControllerDrawerState {
    host: string,
    port: string
}

export class ExternalControllerDrawer extends React.Component<ExternalControllerDrawerProps, ExternalControllerDrawerState> {

    state = {
        host: this.props.host,
        port: this.props.port
    }

    private handleOk = () => {
        const { onConfirm } = this.props
        const { host, port } = this.state
        onConfirm(host, port)
    }

    render () {
        const { show, onCancel } = this.props
        const { host, port } = this.state

        return (
            <Modal
                show={show}
                title="编辑外部控制设置"
                bodyClassName="external-controller"
                onClose={onCancel}
                onOk={this.handleOk}
            >
                <Alert type="info" inside={true}>
                    <p>请注意，修改该配置项并不会修改你的 Clash 配置文件，请确认修改后的外部控制地址和 Clash 配置文件内的地址一致，否则会导致 Dashboard 无法连接。</p>
                </Alert>
                <Row gutter={24} align="middle">
                    <Col span={4} className="title">Host</Col>
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
                    <Col span={4} className="title">端口</Col>
                    <Col span={20} className="form">
                        <Input
                            align="left"
                            inside={true}
                            value={port}
                            onChange={port => this.setState({ port })}
                        />
                    </Col>
                </Row>
            </Modal>
        )
    }
}
