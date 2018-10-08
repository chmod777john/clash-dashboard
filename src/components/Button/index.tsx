import * as React from 'react'
import classnames from 'classnames'
import { BaseComponentProps } from '@models'
import './style.scss'

interface ButtonProps extends BaseComponentProps {
    type?: 'primary' | 'normal' | 'danger' | 'success' | 'warning'
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export class Button extends React.Component<ButtonProps, {}> {

    static defaultProps: ButtonProps = {
        type: 'normal',
        onClick: () => {}
    }

    render () {
        const { type, onClick, children, className, style } = this.props

        return (
            <button
                className={classnames('button', `button-${type}`, className)}
                style={style}
                onClick={onClick}
            >{children}</button>
        )
    }

}
