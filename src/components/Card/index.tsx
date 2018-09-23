import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import classnames from 'classnames'
import './style.scss'

interface CardProps extends BaseComponentProps {}

export const Card: React.SFC<CardProps> = props => {
    const { className, style, children } = props
    return (
        <div className={classnames('card', className)} style={style}>
            { children }
        </div>
    )
}
