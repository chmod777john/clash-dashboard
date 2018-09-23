import * as React from 'react'
import { BaseComponentProps, ProxyType } from '@models'
import classnames from 'classnames'

import './style.scss'
const shadowsocks = require('@assets/proxy/shadowsocks.svg')
const vmess = require('@assets/proxy/vmess.svg')
const iconMapping = {
    [ProxyType.Shadowsocks]: shadowsocks,
    [ProxyType.Shadowsocks]: shadowsocks,
    [ProxyType.Vmess]: vmess
}

interface ProxyProps extends BaseComponentProps {
    type: ProxyType
    name: string
}

const Proxy: React.SFC<ProxyProps> = props => {
    const { type, name, className } = props
    const icon = iconMapping[type]
    return (
        <div className={classnames('proxy', className)}>
            <img className="proxy-icon" src={icon}/>
            <span className="proxy-name">{ name }</span>
        </div>
    )
}

export default Proxy
