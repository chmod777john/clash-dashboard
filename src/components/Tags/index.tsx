import React, { useState, useRef, useLayoutEffect } from 'react'
import { useI18n } from '@stores'
import { BaseComponentProps } from '@models'
import { noop } from '@lib/helper'
import classnames from 'classnames'
import './style.scss'

interface TagsProps extends BaseComponentProps {
    data: string[]
    onClick: (name: string) => void
    errSet?: Set<string>
    select: string
    rowHeight: number
    canClick: boolean
}

export function Tags (props: TagsProps) {
    const { className, data, onClick, select, canClick, errSet, rowHeight: rawHeight } = props

    const { useTranslation } = useI18n()
    const { t } = useTranslation('Proxies')
    const [expand, setExpand] = useState(false)
    const [showExtend, setShowExtend] = useState(false)

    const ulRef = useRef<HTMLUListElement>(null)
    useLayoutEffect(() => {
        setShowExtend((ulRef?.current?.offsetHeight ?? 0) > 30)
    }, [])

    const rowHeight = expand ? 'auto' : rawHeight
    const handleClick = canClick ? onClick : noop

    function toggleExtend () {
        setExpand(!expand)
    }

    const tags = data
        .map(t => {
            const tagClass = classnames({ 'tags-selected': select === t, 'can-click': canClick, error: errSet?.has(t) })
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
