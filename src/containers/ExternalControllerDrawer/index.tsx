import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { Modal, Input, Alert, Button, error } from '@components'
import { useObject } from '@lib/hook'
import { useI18n, useAPIInfo, identityAtom } from '@stores'
import { hostSelectIdxStorageAtom, hostsStorageAtom } from '@stores/request'
import './style.scss'

export default function ExternalController () {
    const { translation } = useI18n()
    const { t } = translation('Settings')
    const { hostname, port, secret } = useAPIInfo()
    const [identity, setIdentity] = useAtom(identityAtom)
    const [value, set] = useObject({
        hostname: '',
        port: '',
        secret: '',
    })

    useEffect(() => {
        set({ hostname, port, secret })
    }, [hostname, port, secret, set])

    const [hosts, setter] = useAtom(hostsStorageAtom)
    const [hostSelectIdx, setHostSelectIdx] = useAtom(hostSelectIdxStorageAtom)

    function handleOk () {
        const { hostname, port, secret } = value
        setter([{ hostname, port, secret }])
    }

    function handleAdd () {
        const { hostname, port, secret } = value
        const nextHosts = [...hosts, { hostname, port, secret }]
        setter(nextHosts)
        setHostSelectIdx(nextHosts.length - 1)
    }

    function handleDelete () {
        const { hostname, port } = value
        const idx = hosts.findIndex(h => h.hostname === hostname && h.port === port)
        if (idx === -1) {
            error(t('externalControllerSetting.deleteErrorText'))
            return
        }

        const nextHosts = [...hosts.slice(0, idx), ...hosts.slice(idx + 1)]
        setter(nextHosts)
        if (hostSelectIdx >= idx) {
            setHostSelectIdx(0)
        }
    }

    const footerExtra = (
        <div className="space-x-3">
            <Button type="primary" onClick={() => handleAdd()}>{ t('externalControllerSetting.addText') }</Button>
            <Button type="danger" disabled={hosts.length < 2} onClick={() => handleDelete()}>{ t('externalControllerSetting.deleteText') }</Button>
        </div>
    )

    return (
        <Modal
            className="!w-105 !<sm:w-84"
            show={!identity}
            title={t('externalControllerSetting.title')}
            bodyClassName="external-controller"
            footerExtra={footerExtra}
            onClose={() => setIdentity(true)}
            onOk={handleOk}
        >
            <Alert type="info" inside={true}>
                <p>{t('externalControllerSetting.note')}</p>
            </Alert>
            <div className="flex items-center">
                <span className="my-1 w-14 font-bold md:my-3">{t('externalControllerSetting.host')}</span>
                <Input
                    className="my-1 flex-1 md:my-3"
                    align="left"
                    inside={true}
                    value={value.hostname}
                    onChange={hostname => set('hostname', hostname)}
                    onEnter={handleOk}
                />
            </div>
            <div className="flex items-center">
                <div className="my-1 w-14 font-bold md:my-3">{t('externalControllerSetting.port')}</div>
                <Input
                    className="my-1 w-14 flex-1 md:my-3"
                    align="left"
                    inside={true}
                    value={value.port}
                    onChange={port => set('port', port)}
                    onEnter={handleOk}
                />
            </div>
            <div className="flex items-center">
                <div className="my-1 w-14 font-bold md:my-3">{t('externalControllerSetting.secret')}</div>
                <Input
                    className="my-1 w-14 flex-1 md:my-3"
                    align="left"
                    inside={true}
                    value={value.secret}
                    onChange={secret => set('secret', secret)}
                    onEnter={handleOk}
                />
            </div>
        </Modal>
    )
}
