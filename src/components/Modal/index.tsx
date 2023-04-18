import classnames from 'classnames'
import { useRef, useLayoutEffect, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'

import { Button } from '@components'
import { noop } from '@lib/helper'
import { type BaseComponentProps } from '@models'
import { useI18n } from '@stores'
import './style.scss'

interface ModalProps extends BaseComponentProps {
    // show modal
    show?: boolean

    // modal title
    title: string

    // size
    size?: 'small' | 'big'

    // body className
    bodyClassName?: string

    // body style
    bodyStyle?: React.CSSProperties

    // show footer
    footer?: boolean

    // footer extra
    footerExtra?: React.ReactNode

    // on click ok
    onOk?: typeof noop

    // on click close
    onClose?: typeof noop
}

export function Modal (props: ModalProps) {
    const {
        show = true,
        title = 'Modal',
        size = 'small',
        footer = true,
        onOk = noop,
        onClose = noop,
        bodyClassName,
        bodyStyle,
        className,
        footerExtra,
        style,
        children,
    } = props

    const { translation } = useI18n()
    const { t } = translation('Modal')

    const portalRef = useRef<HTMLDivElement>(document.createElement('div'))
    const maskRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const current = portalRef.current
        document.body.appendChild(current)
        return () => { document.body.removeChild(current) }
    }, [])

    function handleMaskMouseDown (e: MouseEvent) {
        if (e.target === maskRef.current) {
            onClose()
        }
    }

    const modal = (
        <div
            className={classnames('modal-mask', { 'modal-show': show })}
            ref={maskRef}
            onMouseDown={handleMaskMouseDown}
        >
            <div
                className={classnames('modal', `modal-${size}`, className)}
                style={style}
            >
                <div className="modal-title">{title}</div>
                <div
                    className={classnames('modal-body', bodyClassName)}
                    style={bodyStyle}
                >{children}</div>
                {
                    footer && (
                        <div className="flex items-center justify-between">
                            {footerExtra}
                            <div className="flex flex-1 justify-end space-x-3">
                                <Button onClick={() => onClose()}>{ t('cancel') }</Button>
                                <Button type="primary" onClick={() => onOk()}>{ t('ok') }</Button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )

    return createPortal(modal, portalRef.current)
}
