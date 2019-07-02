import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import { noop } from '@lib/helper'
import classnames from 'classnames'
import './style.scss'

interface InputProps extends BaseComponentProps {
    value?: string | number
    align?: 'left' | 'center' | 'right'
    inside?: boolean
    autoFocus?: boolean
    type?: string
    onChange?: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (event?: React.FocusEvent<HTMLInputElement>) => void
}

export function Input (props: InputProps) {
    const {
        className,
        style,
        value = '',
        align = 'center',
        inside = false,
        autoFocus = false,
        type = 'text',
        onChange = noop,
        onBlur = noop
    } = props
    const classname = classnames('input', `input-align-${align}`, { 'input-inside': inside }, className)

    return (
        <input
            className={classname}
            style={style}
            value={value}
            autoFocus={autoFocus}
            type={type}
            onChange={event => onChange(event.target.value, event)}
            onBlur={onBlur}
        />
    )
}
