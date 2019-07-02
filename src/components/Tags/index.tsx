import React, { useState, useRef, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BaseComponentProps, I18nProps } from '@models'
import { noop } from '@lib/helper'
import classnames from 'classnames'
import './style.scss'

interface TagsProps extends BaseComponentProps, I18nProps {
    data: string[]
    onClick: (name: string) => void
    select: string
    rowHeight: number
    canClick: boolean
}

export function Tags (props: TagsProps) {
    const { className, data, onClick, select, canClick, rowHeight: rawHeight } = props

    const { t } = useTranslation(['Proxies'])
    const [expand, setExpand] = useState(false)
    const [showExtend, setShowExtend] = useState(false)

    const ulRef = useRef<HTMLUListElement>()
    useLayoutEffect(() => {
        setShowExtend(ulRef.current.offsetHeight > 30)
    }, [])

    const rowHeight = expand ? 'auto' : rawHeight
    const handleClick = canClick ? onClick : noop

    function toggleExtend () {
        setExpand(!expand)
    }

    const tags = data
        .map(t => {
            const tagClass = classnames({ 'tags-selected': select === t, 'can-click': canClick })
            return (
                <li className={tagClass} key={t} onClick={() => handleClick(t)}>
                    { t }
                </li>
            )
        })

    return (
        <div className={classnames('tags-container', className)} style={{ height: rowHeight }}>
            <ul ref={ulRef} className={classnames('tags', { expand })}>
                { tags }
            </ul>
            {
                showExtend &&
                <span className="tags-expand" onClick={toggleExtend}>{ expand ? t('collapseText') : t('expandText') }</span>
            }
        </div>
    )
}
