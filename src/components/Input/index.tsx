import classnames from 'classnames'
import * as React from 'react'

import { noop } from '@lib/helper'
import { BaseComponentProps } from '@models/BaseProps'
import './style.scss'

interface InputProps extends BaseComponentProps {
    value?: string | number
    align?: 'left' | 'center' | 'right'
    inside?: boolean
    autoFocus?: boolean
    type?: string
    disabled?: boolean
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
        disabled = false,
        onChange = noop,
        onBlur = noop,
    } = props
    const classname = classnames('input', `text-${align}`, { 'focus:shadow-none': inside }, className)

    return (
        <input
            disabled={disabled}
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
