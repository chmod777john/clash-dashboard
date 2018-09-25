import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import classnames from 'classnames'
import './style.scss'

interface RowProps extends BaseComponentProps {
    // grid column
    gutter?: number

    // row align
    align?: 'top' | 'middle' | 'bottom'

    // column justify
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between'
}

export const Row: React.SFC<RowProps> = props => {
    const {
        gutter = 24,
        align = 'top',
        justify = 'start',
        className,
        style,
        children
    } = props

    return (
        <div className={classnames(
            'row',
            `row-gutter-${gutter}`,
            `row-align-${align}`,
            `row-justify-${justify}`,
            className
        )} style={style}>
            { children }
        </div>
    )
}
