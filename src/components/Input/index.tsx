import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
// import classnames from 'classnames'
import './style.scss'

interface InputProps extends BaseComponentProps {
    value?: string | number
    disabled?: boolean
    onChange?: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void
}

export class Input extends React.Component<InputProps, {}> {
    static defaultProps: InputProps = {
        value: '',
        disabled: false,
        onChange: () => {}
    }

    render() {
        const { onChange, value } = this.props
        return (
            <input className="input" onChange={(event) => {
                onChange(event.target.value, event)
            }} value={value} ></input>
        )
    }
}