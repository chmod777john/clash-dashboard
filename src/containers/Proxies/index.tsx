import React, { useLayoutEffect, useState, useMemo } from 'react'
import EE from '@lib/event'
import { Card, Header, Icon } from '@components'
import { containers } from '@stores'
import * as API from '@lib/request'

import { Proxy, Group } from './components'
import './style.scss'

enum sortType {
    None,
    Asc,
    Desc
}

const sortMap = {
    [sortType.None]: 'sort',
    [sortType.Asc]: 'sort-ascending',
    [sortType.Desc]: 'sort-descending'
}

function compareDesc (a: API.Proxy, b: API.Proxy) {
    const lastDelayA = a.history.length ? a.history.slice(-1)[0].delay : 0
    const lastDelayB = b.history.length ? b.history.slice(-1)[0].delay : 0
    return (lastDelayB || Number.MAX_SAFE_INTEGER) - (lastDelayA || Number.MAX_SAFE_INTEGER)
}

export default function Proxies () {
    const { data, fetch } = containers.useData()
    const { useTranslation } = containers.useI18n()
    const { t } = useTranslation('Proxies')

    useLayoutEffect(() => {
        fetch()
    }, [])
    function handleNotitySpeedTest () {
        EE.notifySpeedTest()
    }

    const [sort, setSort] = useState(sortType.None)
    const proxies = useMemo(() => {
        console.log(1)
        switch (sort) {
        case sortType.Desc:
            return data.proxy.slice().sort((a, b) => compareDesc(a, b))
        case sortType.Asc:
            return data.proxy.slice().sort((a, b) => -1 * compareDesc(a, b))
        default:
            return data.proxy.slice()
        }
    }, [sort, data])
    function handleSort () {
        setSort((sort + 1) % 3)
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
                    <Icon className="proxies-action-icon" type={sortMap[sort]} onClick={handleSort} size={20} />
                    <Icon className="proxies-action-icon" type="speed" size={20} />
                    <span className="proxies-speed-test" onClick={handleNotitySpeedTest}>{t('speedTestText')}</span>
                </Header>
                <ul className="proxies-list">
                    {
                        proxies.map(p => (
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
