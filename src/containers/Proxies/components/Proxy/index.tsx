import React, { useState, useMemo, useLayoutEffect, useEffect } from 'react'
import classnames from 'classnames'
import { BaseComponentProps } from '@models'
import { getProxyDelay, Proxy as IProxy } from '@lib/request'
import EE, { Action } from '@lib/event'
import { isClashX, jsBridge } from '@lib/jsBridge'
import { to } from '@lib/helper'
import './style.scss'

interface ProxyProps extends BaseComponentProps {
    config: IProxy
}

const TagColors = {
    '#909399': 0,
    '#00c520': 150,
    '#ff9a28': 500,
    '#ff3e5e': Infinity
}

async function getDelay (name: string) {
    if (isClashX()) {
        const delay = await jsBridge.getProxyDelay(name)
        return delay
    }

    const { data: { delay } } = await getProxyDelay(name)
    return delay
}

export function Proxy (props: ProxyProps) {
    const { config, className } = props
    const [delay, setDelay] = useState(0)

    async function speedTest () {
        const [delay, err] = await to(getDelay(config.name))
        setDelay(err ? 0 : delay)
    }

    useEffect(() => {
        setDelay(config.history.length ? config.history.slice(-1)[0].delay : 0)
    }, [config])

    useLayoutEffect(() => {
        EE.subscribe(Action.SPEED_NOTIFY, speedTest)
        return () => EE.unsubscribe(Action.SPEED_NOTIFY, speedTest)
    }, [])

    const hasError = useMemo(() => delay === 0, [delay])
    const color = useMemo(() => Object.keys(TagColors).find(threshold => delay <= TagColors[threshold]), [delay])

    const backgroundColor = hasError ? undefined : color
    return (
        <div className={classnames('proxy-item', { 'proxy-error': hasError }, className)}>
            <span className="proxy-type" style={{ backgroundColor }}>{config.type}</span>
            <p className="proxy-name">{config.name}</p>
            <p className="proxy-delay">{delay === 0 ? '-' : `${delay}ms`}</p>
        </div>
    )
}
