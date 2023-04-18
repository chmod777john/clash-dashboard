import classnames from 'classnames'

import { Icon } from '@components'
import { noop } from '@lib/helper'
import { type BaseComponentProps } from '@models/BaseProps'
import './style.scss'

interface SwitchProps extends BaseComponentProps {
    checked: boolean
    disabled?: boolean
    onChange?: (checked: boolean) => void
}

export function Switch (props: SwitchProps) {
    const { className, checked = false, disabled = false, onChange = noop } = props
    const classname = classnames('switch', { checked, disabled }, className)

    function handleClick () {
        if (!disabled) {
            onChange(!checked)
        }
    }

    return (
        <div className={classname} onClick={handleClick}>
            <Icon className="switch-icon font-bold" type="check" size={20} />
        </div>
    )
}
