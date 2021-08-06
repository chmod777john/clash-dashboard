import classnames from 'classnames'
import * as React from 'react'

import { BaseComponentProps } from '@models/BaseProps'

import './style.scss'

interface TagProps extends BaseComponentProps {
    color?: string
}

export function Tag (props: TagProps) {
    const { color, className: cn, style: s } = props
    const className = classnames('tag', cn)
    const style: React.CSSProperties = { color, ...s }
    const spanProps = { ...props, className, style }

    return <span {...spanProps}>{ props.children }</span>
}
