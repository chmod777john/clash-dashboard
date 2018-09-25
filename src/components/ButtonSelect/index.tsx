import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import classnames from 'classnames'
import './style.scss'

export interface ButtonSelectOptions {
    label: string,
    value: any
}

export interface ButtonSelectProps extends BaseComponentProps {
    // options
    options: ButtonSelectOptions[]

    // active value
    value: any

    // select callback
    onSelect?: (value: any) => void
}

export class ButtonSelect extends React.Component<ButtonSelectProps, {}> {

    render () {
        const { options, value, onSelect } = this.props

        return (
            <div className="button-select">
                {
                    options.map(option => (
                        <button
                            value={option.value}
                            key={option.value}
                            className={classnames('button-select-options', { actived: value === option.value })}
                            onClick={() => onSelect(option.value)}
                        >{option.label}</button>
                    ))
                }
            </div>
        )
    }

}
