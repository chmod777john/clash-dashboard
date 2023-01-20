import classnames from 'classnames'
import { useLayoutEffect } from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { Icon } from '@components'
import { noop } from '@lib/helper'
import { useVisible } from '@lib/hook'
import './style.scss'

const TYPE_ICON_MAP = {
    info: 'info',
    success: 'check',
    warning: 'info-o',
    error: 'close',
}

type NoticeType = 'success' | 'info' | 'warning' | 'error'

interface ArgsProps {
    content: string
    type: NoticeType
    duration?: number
    onClose?: typeof noop
}

interface MessageProps {
    content?: string
    type?: NoticeType
    icon?: React.ReactNode
    duration?: number
    onClose?: typeof noop
    removeComponent: typeof noop
}

export function Message (props: MessageProps) {
    const {
        removeComponent = noop,
        onClose = noop,
        icon = <Icon type="info" size={16} />,
        content = '',
        type = 'info',
        duration = 1500,
    } = props

    const { visible, show, hide } = useVisible()

    useLayoutEffect(() => {
        window.setTimeout(() => show(), 0)

        const id = window.setTimeout(() => {
            hide()
            onClose()
        }, duration)
        return () => window.clearTimeout(id)
    }, [duration, hide, onClose, show])

    return (
        <div
            className={classnames('message', `message-${type}`, { 'message-show': visible })}
            onTransitionEnd={() => !visible && removeComponent()}
        >
            <span className="message-icon">{icon}</span>
            <span className="message-content">{content}</span>
        </div>
    )
}

export function showMessage (args: ArgsProps) {
    // create container element
    const container = document.createElement('div')
    document.body.appendChild(container)

    // remove container when component unmount
    const removeComponent = () => {
        const isUnMount = unmountComponentAtNode(container)
        if (isUnMount) {
            document.body.removeChild(container)
        }
    }

    const icon = <Icon type={TYPE_ICON_MAP[args.type]} size={16}></Icon>
    const { type, content, duration, onClose } = args
    const props: MessageProps = {
        icon,
        type,
        content,
        removeComponent,
        duration,
        onClose,
    }

    createRoot(container).render(<Message {...props} />)
}

export const info = (
    content: string,
    duration?: number,
    onClose?: typeof noop,
) => showMessage({ type: 'info', content, duration, onClose })

export const success = (
    content: string,
    duration?: number,
    onClose?: typeof noop,
) => showMessage({ type: 'success', content, duration, onClose })

export const warning = (
    content: string,
    duration?: number,
    onClose?: typeof noop,
) => showMessage({ type: 'warning', content, duration, onClose })

export const error = (
    content: string,
    duration?: number,
    onClose?: typeof noop,
) => showMessage({ type: 'error', content, duration, onClose })
