import * as React from 'react'
import classnames from 'classnames'
import { BaseComponentProps, Proxy as IProxy } from '@models'
import { getProxyDelay } from '@lib/request'
import { to } from '@lib/helper'
import './style.scss'

interface ProxyProps extends BaseComponentProps, IProxy {}

interface ProxyState {
    delay: number
    hasError: boolean
}

export class Proxy extends React.Component<ProxyProps, ProxyState> {

    state = {
        delay: -1,
        hasError: false
    }

    async componentDidMount () {
        const { name } = this.props
        const [res, err] = await to(getProxyDelay(name))

        if (err) {
            return this.setState({ hasError: true })
        }

        const { data: { delay } } = res
        this.setState({ delay })
    }

    render () {
        const { name, className } = this.props
        const { delay, hasError } = this.state

        return (
            <div className={classnames('proxy-item', { 'proxy-error': hasError }, className)}>
                <span className="proxy-name">{name}</span>
                <span className="proxy-delay">{delay === -1 ? '-' : `${delay}s`}</span>
            </div>
        )
    }
}
