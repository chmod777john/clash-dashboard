import React, { MouseEventHandler } from 'react'
import classnames from 'classnames'
import { BaseComponentProps } from '@models'
import { noop } from '@lib/helper'
import './style.scss'

interface ButtonProps extends BaseComponentProps {
    type?: 'primary' | 'normal' | 'danger' | 'success' | 'warning'
    onClick?: MouseEventHandler<HTMLButtonElement>
    disiabled?: boolean
}

export function Button (props: ButtonProps) {
    const { type = 'normal', onClick = noop, children, className, style, disiabled } = props
    const classname = classnames('button', `button-${type}`, className, { 'button-disabled': disiabled })

    return (
        <button
            className={classname}
            style={style}
            onClick={onClick}
            disabled={disiabled}
        >{children}</button>
    )
}
