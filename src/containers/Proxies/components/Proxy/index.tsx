import * as React from 'react'
import classnames from 'classnames'
import { BaseComponentProps, TagColors } from '@models'
import { getProxyDelay, Proxy as IProxy } from '@lib/request'
import EE, { Action } from '@lib/event'
import { isClashX, jsBridge } from '@lib/jsBridge'
import { to, getLocalStorageItem, setLocalStorageItem, sample } from '@lib/helper'
import './style.scss'

interface ProxyProps extends BaseComponentProps {
    config: IProxy
    // onEdit?: (e: React.MouseEvent<HTMLElement>) => void
}

interface ProxyState {
    delay: number
    hasError: boolean
    color: string
}

export class Proxy extends React.Component<ProxyProps , ProxyState> {
    constructor (props: ProxyProps) {
        super(props)

        const { config } = props
        const { name } = config
        let color = getLocalStorageItem(name)

        if (!color) {
            color = sample(TagColors)
            setLocalStorageItem(name, color)
        }

        const delay = config.history.length ? config.history.slice(-1)[0].delay : 0
        this.state = {
            delay,
            hasError: delay === 0,
            color
        }
    }

    componentWillUpdate () {
        const { config: { name } } = this.props
        const { color: rawColor } = this.state
        const color = getLocalStorageItem(name)

        if (rawColor !== color) {
            this.setState({ color })
        }
    }

    componentDidMount () {
        EE.subscribe(Action.SPEED_NOTIFY, this.speedTest)
    }

    componentWillUnmount () {
        EE.unsubscribe(Action.SPEED_NOTIFY, this.speedTest)
    }

    speedTest = async () => {
        const { config } = this.props
        if (isClashX()) {
            const delay = await jsBridge.getProxyDelay(config.name)
            if (delay === 0) {
                return this.setState({ hasError: true })
            }
            return this.setState({ delay })
        }

        const [res, err] = await to(getProxyDelay(config.name))

        if (err) {
            return this.setState({ hasError: true })
        }

        const { data: { delay } } = res
        this.setState({ delay })
    }

    render () {
        const { config, className } = this.props
        const { delay, color, hasError } = this.state
        const backgroundColor = hasError ? undefined : color

        return (
            <div className={classnames('proxy-item', { 'proxy-error': hasError }, className)}>
                <span className="proxy-type" style={{ backgroundColor }}>{config.type}</span>
                <p className="proxy-name">{config.name}</p>
                <p className="proxy-delay">{delay === 0 ? '-' : `${delay}ms`}</p>
                {/* <Icon className="proxy-editor" type="setting" onClick={onEdit} /> */}
            </div>
        )
    }
}
