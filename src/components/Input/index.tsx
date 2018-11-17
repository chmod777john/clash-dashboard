import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import classnames from 'classnames'
import './style.scss'

interface InputProps extends BaseComponentProps {
    value?: string | number
    disabled?: boolean
    align?: 'left' | 'center' | 'right'
    inside?: boolean
    autoFocus?: boolean
    type?: string
    onChange?: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (event?: React.FocusEvent<HTMLInputElement>) => void
}

export class Input extends React.Component<InputProps, {}> {
    static defaultProps: InputProps = {
        value: '',
        disabled: false,
        align: 'center',
        inside: false,
        autoFocus: false,
        type: 'text',
        onChange: () => {},
        onBlur: () => {}
    }

    render () {
        const {
            className,
            style,
            value,
            align,
            inside,
            autoFocus,
            type,
            onChange,
            onBlur
        } = this.props

        return (
            <input
                className={classnames('input', `input-align-${align}`, { 'input-inside': inside }, className)}
                style={style}
                value={value}
                autoFocus={autoFocus}
                type={type}
                onChange={event => onChange(event.target.value, event)}
                onBlur={onBlur}
            />
        )
    }
}
