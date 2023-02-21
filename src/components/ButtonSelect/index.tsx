import classnames from 'classnames'

import { type BaseComponentProps } from '@models/BaseProps'
import './style.scss'

export interface ButtonSelectOptions<T = string> {
    label: string
    value: T
}

export interface ButtonSelectProps<T = string> extends BaseComponentProps {
    // options
    options: Array<ButtonSelectOptions<T>>

    // active value
    value: T

    // select callback
    onSelect?: (value: T) => void
}

export function ButtonSelect (props: ButtonSelectProps) {
    const { options, value, onSelect } = props

    return (
        <div className="button-select">
            {
                options.map(option => (
                    <button
                        value={option.value}
                        key={option.value}
                        className={classnames('button-select-options', { actived: value === option.value })}
                        onClick={() => onSelect?.(option.value)}>
                        { option.label }
                    </button>
                ))
            }
        </div>
    )
}
