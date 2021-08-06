import classnames from 'classnames'
import * as React from 'react'

import { BaseComponentProps } from '@models/BaseProps'

interface IconProps extends BaseComponentProps {
    // icon type
    type: string

    // icon size
    size?: number

    onClick?: React.FormEventHandler
}

export function Icon (props: IconProps) {
    const { type, size = 14, className: cn, style: s } = props
    const className = classnames('clash-iconfont', `icon-${type}`, cn)
    const style: React.CSSProperties = { fontSize: size, ...s }
    const iconProps = { ...props, className, style }

    return <i {...iconProps} />
}
