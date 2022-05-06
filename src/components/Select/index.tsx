import classnames from 'classnames'
import { useRef, useState, useMemo, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'

import { Icon } from '@components'
import { noop } from '@lib/helper'
import { BaseComponentProps } from '@models'

import './style.scss'

export interface SelectOptions<T extends string | number> {
    label: string
    value: T
    disabled?: boolean
    key?: React.Key
}

interface SelectProps<T extends string | number> extends BaseComponentProps {
    /**
     * selected value
     * must match one of options
     */
    value: T

    options: Array<SelectOptions<T>>

    onSelect?: (value: T, e: React.MouseEvent<HTMLLIElement>) => void
}

export function Select<T extends string | number> (props: SelectProps<T>) {
    const { value, options, onSelect, className: cn, style } = props

    const portalRef = useRef(document.createElement('div'))
    const targetRef = useRef<HTMLDivElement>(null)

    const [showDropDownList, setShowDropDownList] = useState(false)
    const [dropdownListStyles, setDropdownListStyles] = useState<React.CSSProperties>({})
    useLayoutEffect(() => {
        const targetRectInfo = targetRef.current!.getBoundingClientRect()
        setDropdownListStyles({
            top: Math.floor(targetRectInfo.top + targetRectInfo.height) + 6,
            left: Math.floor(targetRectInfo.left) - 10,
        })
    }, [])

    useLayoutEffect(() => {
        const current = portalRef.current
        document.body.appendChild(current)
        return () => {
            document.body.removeChild(current)
        }
    }, [])

    function handleShowDropList () {
        setShowDropDownList(!showDropDownList)
    }

    const matchChild = useMemo(
        () => options.find(o => o.value === value),
        [value, options],
    )

    const dropDownList = (
        <div
            className={classnames('select-list', { 'select-list-show': showDropDownList })}
            style={dropdownListStyles}
        >
            <ul className="list">
                {
                    options.map(option => (
                        <Option
                            className={classnames({ selected: option.value === value })}
                            onClick={e => {
                                onSelect?.(option.value, e)
                                setShowDropDownList(false)
                            }}
                            disabled={option.disabled}
                            key={option.key ?? option.value}
                            value={option.value}>
                            {option.label}
                        </Option>
                    ))
                }
            </ul>
        </div>
    )

    return (
        <>
            <div
                className={classnames('select', cn)}
                style={style}
                ref={targetRef}
                onClick={handleShowDropList}
            >
                {matchChild?.label}
                <Icon type="triangle-down" />
            </div>
            {createPortal(dropDownList, portalRef.current)}
        </>
    )
}

interface OptionProps<T> extends BaseComponentProps {
    value: T
    disabled?: boolean
    onClick?: (e: React.MouseEvent<HTMLLIElement>) => void
}

function Option<T> (props: OptionProps<T>) {
    const { className: cn, style, disabled = false, children, onClick = noop } = props
    const className = classnames('option', { disabled }, cn)

    return (
        <li className={className} style={style} onClick={onClick}>{children}</li>
    )
}
