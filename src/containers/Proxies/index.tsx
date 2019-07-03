import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import EE from '@lib/event'
import { Card, Header, Icon } from '@components'
import { Data } from '@stores'

import { Proxy, Group } from './components'
import './style.scss'

export default function Proxies () {
    const { data, fetch } = Data.useContainer()
    const { t } = useTranslation(['Proxies'])

    useLayoutEffect(() => {
        fetch()
    }, [])

    function handleNotitySpeedTest () {
        EE.notifySpeedTest()
    }

    return (
        <div className="page">
            <div className="proxies-container">
                <Header title={t('groupTitle')} />
                <Card className="proxies-group-card">
                    <ul className="proxies-group-list">
                        {
                            data.proxyGroup.map(p => (
                                <li className="proxies-group-item" key={p.name}>
                                    <Group config={p} />
                                </li>
                            ))
                        }
                    </ul>
                </Card>
            </div>
            <div className="proxies-container">
                <Header title={t('title')}>
                    <Icon type="speed" size={20} />
                    <span className="proxies-speed-test" onClick={handleNotitySpeedTest}>{t('speedTestText')}</span>
                </Header>
                <ul className="proxies-list">
                    {
                        data.proxy.map(p => (
                            <li key={p.name}>
                                <Proxy config={p} />
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}
