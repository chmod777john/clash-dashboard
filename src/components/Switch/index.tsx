import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import { Icon } from '@components'
import classnames from 'classnames'
import './style.scss'

interface SwitchProps extends BaseComponentProps {
    checked: boolean
    disabled?: boolean
    onChange?: (checked: boolean) => void
}

export class Switch extends React.Component<SwitchProps, {}> {
    static defaultProps: SwitchProps = {
        checked: false,
        disabled: false,
        onChange: () => {}
    }

    handleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        if (!this.props.disabled) {
            this.props.onChange(!this.props.checked)
        }
    }

    render () {
        const { className, checked, disabled } = this.props

        return (
            <div className={classnames('switch', { checked, disabled }, className)} onClick={this.handleClick}>
                <Icon className="switch-icon" type="check" size={8} />
            </div>
        )
    }
}
