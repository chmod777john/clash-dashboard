import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import classnames from 'classnames'
import './style.scss'

type CardProps = BaseComponentProps

export function Card (props: CardProps) {
    const { className, style, children } = props
    return (
        <div className={classnames('card', className)} style={style}>
            { children }
        </div>
    )
}
