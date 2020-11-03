import React from 'react'
import classnames from 'classnames'
import { BaseComponentProps } from '@models'
import './style.scss'

interface DevicesProps extends BaseComponentProps {
    devices: Array<{ label: string, number: number }>
    selected: string
    onChange?: (label: string) => void
}

export function Devices (props: DevicesProps) {
    const { className, style } = props
    const classname = classnames('connections-devices', className)
    function handleSelected (label: string) {
        props.onChange?.(label)
    }

    return (
        <div className={classname} style={style}>
            <div className={classnames('connections-devices-item', { selected: props.selected === '' })} onClick={() => handleSelected('')}>全部</div>
            {
                props.devices.map(
                    device => (
                        <div
                            className={classnames('connections-devices-item', { selected: props.selected === device.label })}
                            onClick={() => handleSelected(device.label)}>
                            { device.label } ({ device.number })
                        </div>
                    )
                )
            }
        </div>
    )
}
