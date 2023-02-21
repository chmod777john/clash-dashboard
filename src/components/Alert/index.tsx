import classnames from 'classnames'

import { Icon } from '@components'
import { type BaseComponentProps } from '@models'
import './style.scss'

interface AlertProps extends BaseComponentProps {
    message?: string
    type?: 'success' | 'info' | 'warning' | 'error'
    inside?: boolean
}

const iconMap = {
    success: 'check',
    info: 'info',
    warning: 'info',
    error: 'close',
}

export function Alert (props: AlertProps) {
    const { message = '', type = 'info', inside = false, children, className, style } = props
    const classname = classnames('alert', `alert-${inside ? 'note' : 'box'}-${type}`, className)
    return (
        <div className={classname} style={style}>
            <span className="alert-icon">
                <Icon type={iconMap[type]} size={26} />
            </span>
            {
                message
                    ? <p className="alert-message">{message}</p>
                    : <div className="alert-message">{children}</div>
            }
        </div>
    )
}
