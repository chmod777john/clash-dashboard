import * as React from 'react'
import classnames from 'classnames'
import { Icon } from '@components'
import { BaseComponentProps } from '@models'
import './style.scss'

interface AlertProps extends BaseComponentProps {
    message?: string
    type?: 'success' | 'info' | 'warning' | 'error'
    inside?: boolean
}

export class Alert extends React.Component<AlertProps, {}> {

    static defaultProps: AlertProps = {
        message: '',
        type: 'info',
        inside: false
    }

    iconMap = {
        success: 'check',
        info: 'info',
        warning: 'info',
        error: 'close'
    }

    render () {
        const { message, type, inside, children, className, style } = this.props

        return (
            <div className={classnames('alert', `alert-${inside ? 'note' : 'box'}-${type}`, className)} style={style}>
                <span className="alert-icon">
                    <Icon type={this.iconMap[type]} size={26} />
                </span>
                {
                    message
                        ? <p className="alert-message">{message}</p>
                        : <div className="alert-message">{children}</div>
                }
            </div>
        )
    }

}
