import classnames from 'classnames'

import { Icon } from '@components'
import { noop } from '@lib/helper'
import { type BaseComponentProps } from '@models/BaseProps'
import './style.scss'

interface CheckboxProps extends BaseComponentProps {
    checked: boolean
    onChange?: (checked: boolean) => void
}

export function Checkbox (props: CheckboxProps) {
    const { className, checked = false, onChange = noop } = props
    const classname = classnames('checkbox', { checked }, className)

    function handleClick () {
        onChange(!checked)
    }

    return (
        <div className={classname} onClick={handleClick}>
            <Icon className="checkbox-icon" type="check" size={18} />
            <div>{ props.children }</div>
        </div>
    )
}
