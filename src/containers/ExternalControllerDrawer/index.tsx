import React, { useEffect } from 'react'
import { useObject } from '@lib/hook'
import { Modal, Input, Row, Col, Alert } from '@components'
import { useI18n, useAPIInfo, useIdentity } from '@stores'
import './style.scss'

export default function ExternalController () {
    const { useTranslation } = useI18n()
    const { t } = useTranslation('Settings')
    const { data: info, update, fetch } = useAPIInfo()
    const { identity, set: setIdentity } = useIdentity()
    const [value, set] = useObject({
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
            show={!identity}
            title={t('externalControllerSetting.title')}
            bodyClassName="external-controller"
            onClose={() => setIdentity(true)}
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
                        onChange={hostname => set('hostname', hostname)}
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
                        onChange={port => set('port', port)}
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
                        onChange={secret => set('secret', secret)}
                    />
                </Col>
            </Row>
        </Modal>
    )
}
