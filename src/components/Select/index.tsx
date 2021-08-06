import classnames from 'classnames'
import React, { useRef, useLayoutEffect, useState, useMemo, ReactElement } from 'react'
import { createPortal } from 'react-dom'

import { Icon } from '@components'
import { noop } from '@lib/helper'
import { BaseComponentProps } from '@models'
import './style.scss'

type OptionValue = string | number

interface SelectProps extends BaseComponentProps {
    /**
     * selected value
     * must match one of options
     */
    value: OptionValue

    children?: ReactElement

    onSelect?: (value: OptionValue, e: React.MouseEvent<HTMLLIElement>) => void
}

export function Select (props: SelectProps) {
    const { value, onSelect, children, className: cn, style } = props

    const portalRef = useRef<HTMLDivElement>(document.createElement('div'))
    const attachmentRef = useRef<HTMLDivElement>(null)
    const targetRef = useRef<HTMLDivElement>(null)

    const [showDropDownList, setShowDropDownList] = useState(false)
    const [hasCreateDropList, setHasCreateDropList] = useState(false)
    const dropdownListStyles = useMemo(() => {
        if (targetRef.current != null) {
            const targetRectInfo = targetRef.current.getBoundingClientRect()
            return {
                top: Math.floor(targetRectInfo.top) - 10,
                left: Math.floor(targetRectInfo.left) - 10,
            }
        }
        return {}
    }, [])

    function handleGlobalClick (e: MouseEvent) {
        const el = attachmentRef.current

        if (el?.contains(e.target as Node)) {
            setShowDropDownList(false)
        }
    }

    useLayoutEffect(() => {
        const current = portalRef.current
        document.body.appendChild(current)
        document.addEventListener('click', handleGlobalClick, true)
        return () => {
            document.addEventListener('click', handleGlobalClick, true)
            document.body.removeChild(current)
        }
    }, [])

    function handleShowDropList () {
        if (!hasCreateDropList) {
            setHasCreateDropList(true)
        }
        setShowDropDownList(true)
    }

    const matchChild = useMemo(() => {
        let matchChild: React.ReactElement | null = null

        React.Children.forEach(children, (child) => {
            if (child?.props?.value === value) {
                matchChild = child
            }
        })

        return matchChild as React.ReactElement | null
    }, [value, children])

    const hookedChildren = useMemo(() => {
        return React.Children.map(children ?? [], (child: React.ReactElement<any>) => {
            if (!child.props || !child.type) {
                return child
            }

            // add classname for selected option
            const className = child.props.value === value
                ? classnames(child.props.className, 'selected')
                : child.props.className

            // hook element onclick event
            const rawOnClickEvent = child.props.onClick
            return React.cloneElement(child, Object.assign({}, child.props, {
                onClick: (e: React.MouseEvent<HTMLLIElement>) => {
                    onSelect?.(child.props.value, e)
                    setShowDropDownList(false)
                    rawOnClickEvent?.(e)
                },
                className,
            }))
        })
    }, [children, value, onSelect])

    const dropDownList = (
        <div
            className={classnames('select-list', { 'select-list-show': showDropDownList })}
            ref={attachmentRef}
            style={dropdownListStyles}
        >
            <ul className="list">
                { hookedChildren }
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
                {matchChild?.props?.children}
                <Icon type="triangle-down" />
            </div>
            {
                hasCreateDropList && createPortal(dropDownList, portalRef.current)
            }
        </>
    )
}

interface OptionProps extends BaseComponentProps {
    key: React.Key
    value: OptionValue
    disabled?: boolean
    onClick?: (e: React.MouseEvent<HTMLLIElement>) => void
}

export function Option (props: OptionProps) {
    const { className: cn, style, key, disabled = false, children, onClick = noop } = props
    const className = classnames('option', { disabled }, cn)

    return (
        <li className={className} style={style} key={key} onClick={onClick}>{children}</li>
    )
}
