import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import classnames from 'classnames'

interface ColProps extends BaseComponentProps {
    // left offset
    offset?: number

    // flex order
    order?: number

    span?: number
}

export const Col: React.SFC<ColProps> = props => {
    const {
        offset = 0,
        order = 0,
        span = 1,
        className,
        style: s,
        children
    } = props

    const style = Object.assign({}, { order }, s)

    return (
        <div className={classnames(
            'column',
            `column-offset-${offset}`,
            `column-span-${span}`,
            className
        )} style={style}>
            { children }
        </div>
    )
}
