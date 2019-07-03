import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useObject } from '@lib/hook'
import { Modal, Input, Row, Col, Alert } from '@components'
import { APIInfo, Data } from '@stores'
import './style.scss'

export default function ExternalController () {
    const { t } = useTranslation(['Settings'])
    const { data: info, update, fetch } = APIInfo.useContainer()
    const { unauthorized: { hidden, visible } } = Data.useContainer()
    const { value, set, change } = useObject({
        hostname: '',
        port: '',
        secret: ''
    })

    useEffect(() => {
        fetch()
    }, [])

    useEffect(() => {
        set({ hostname: info.hostname, port: info.port, secret: info.secret })
    }, [info])

    function handleOk () {
        const { hostname, port, secret } = value
        update({ hostname, port, secret })
    }

    return (
        <Modal
            show={visible}
            title={t('externalControllerSetting.title')}
            bodyClassName="external-controller"
            onClose={hidden}
            onOk={handleOk}
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
                        value={value.hostname}
                        onChange={hostname => change('hostname', hostname)}
                    />
                </Col>
            </Row>
            <Row gutter={24} align="middle">
                <Col span={4} className="title">{t('externalControllerSetting.port')}</Col>
                <Col span={20} className="form">
                    <Input
                        align="left"
                        inside={true}
                        value={value.port}
                        onChange={port => change('port', port)}
                    />
                </Col>
            </Row>
            <Row gutter={24} align="middle">
                <Col span={4} className="title">{t('externalControllerSetting.secret')}</Col>
                <Col span={20} className="form">
                    <Input
                        align="left"
                        inside={true}
                        value={value.secret}
                        onChange={secret => change('secret', secret)}
                    />
                </Col>
            </Row>
        </Modal>
    )
}
