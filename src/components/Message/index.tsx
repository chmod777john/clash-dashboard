import * as React from 'react'
import { Icon } from '@components'
import classnames from 'classnames'
import { unmountComponentAtNode, render } from 'react-dom'
import './style.scss'

const noop = () => {}
const TYPE_ICON_MAP = {
    info: 'info',
    success: 'check',
    warning: 'info-o',
    error: 'close'
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

export class Message extends React.Component <MessageProps, {}> {

    /**
     * static function to call Message directly
     */
    static info = (
        content: string,
        duration?: number,
        onClose?: typeof noop
    ) => showMessage({ type: 'info', content, duration, onClose })

    static success = (
        content: string,
        duration?: number,
        onClose?: typeof noop
    ) => showMessage({ type: 'success', content, duration, onClose })

    static warning = (
        content: string,
        duration?: number,
        onClose?: typeof noop
    ) => showMessage({ type: 'warning', content, duration, onClose })

    static error = (
        content: string,
        duration?: number,
        onClose?: typeof noop
    ) => showMessage({ type: 'error', content, duration, onClose })

    static defaultProps: MessageProps = {
        content: '',
        type: 'info',
        icon: <Icon type="info" size={16} />,
        duration: 1500,
        onClose: noop,
        removeComponent: noop
    }

    state = {
        visible: false
    }

    componentDidMount () {
        // TODO: optimize animation
        // fix do not show animation when element mounted
        setTimeout(() => this.setState({ visible: true }), 0)

        setTimeout(() => {
            this.setState({ visible: false })
            this.props.onClose()
        }, this.props.duration)
    }

    render () {
        const { removeComponent, icon, content, type } = this.props

        return (
            <div
                className={classnames('message', `message-${type}`, { 'message-show': this.state.visible })}
                onTransitionEnd={() => !this.state.visible && removeComponent()}
            >
                <span className="message-icon">{icon}</span>
                <span className="message-content">{content}</span>
            </div>
        )
    }
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
        onClose
    }

    render(<Message {...props} />, container)
}
