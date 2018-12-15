import * as React from 'react'
import classnames from 'classnames'
// import { Icon } from '@components'
import { BaseComponentProps, TagColors } from '@models'
import { getProxyDelay, Proxy as IProxy } from '@lib/request'
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
    constructor (props) {
        super(props)

        const { config } = props
        const { name } = config
        let color = getLocalStorageItem(name)

        if (!color) {
            color = sample(TagColors)
            setLocalStorageItem(name, color)
        }

        this.state = {
            delay: -1,
            hasError: false,
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

    async componentDidMount () {
        const { config } = this.props
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
                <p className="proxy-delay">{delay === -1 ? '-' : `${delay}ms`}</p>
                {/* <Icon className="proxy-editor" type="setting" onClick={onEdit} /> */}
            </div>
        )
    }
}
