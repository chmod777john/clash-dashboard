import React, { useMemo, useLayoutEffect, useCallback } from 'react'
import classnames from 'classnames'
import { BaseComponentProps } from '@models'
import { useProxy } from '@stores'
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
    '#00c520': 260,
    '#ff9a28': 600,
    '#ff3e5e': Infinity
}

async function getDelay (name: string) {
    if (isClashX()) {
        const delay = await jsBridge?.getProxyDelay(name) ?? 0
        return delay
    }

    const { data: { delay } } = await getProxyDelay(name)
    return delay
}

export function Proxy (props: ProxyProps) {
    const { config, className } = props
    const { set } = useProxy()

    const speedTest = useCallback(async function () {
        const [delay, err] = await to(getDelay(config.name))

        const validDelay = err ? 0 : delay
        set(draft => {
            const proxy = draft.proxies.find(p => p.name === config.name)
            if (proxy) {
                proxy.history.push({ time: Date.now().toString(), delay: validDelay })
            }
        })
    }, [config.name, set])

    const delay = useMemo(
        () => config.history?.length ? config.history.slice(-1)[0].delay : 0,
        [config]
    )

    useLayoutEffect(() => {
        EE.subscribe(Action.SPEED_NOTIFY, speedTest)
        return () => EE.unsubscribe(Action.SPEED_NOTIFY, speedTest)
    }, [speedTest])

    const hasError = useMemo(() => delay === 0, [delay])
    const color = useMemo(() =>
        Object.keys(TagColors).find(
            threshold => delay <= TagColors[threshold as keyof typeof TagColors]
        ),
        [delay]
    )

    const backgroundColor = hasError ? undefined : color
    return (
        <div className={classnames('proxy-item', { 'proxy-error': hasError }, className)}>
            <span className="proxy-type" style={{ backgroundColor }}>{config.type}</span>
            <p className="proxy-name">{config.name}</p>
            <p className="proxy-delay">{delay === 0 ? '-' : `${delay}ms`}</p>
        </div>
    )
}
