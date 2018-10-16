import * as React from 'react'
import { Icon } from '@components'
import classnames from 'classnames'
import { unmountComponentAtNode, render } from 'react-dom'
import './style.scss'

type NoticeType = 'success' | 'info' | 'warning' | 'error'
type ConfigOnClose = () => void
interface ArgsProps {
    content: string
    type: NoticeType
    duration?: number
    onClose?: () => void
}

interface MessageProps {
    content?: string
    icon?: React.ReactNode
    onClose?: () => void
    duration?: number
    removeComponent: () => void
}

class Message extends React.Component <MessageProps, {}> {
    static defaultProps: MessageProps = {
        content: '',
        icon: <Icon type={'info'} size={26}></Icon>,
        duration: 1500,
        onClose: () => {},
        removeComponent: () => {}
    }
    state = {
        visible: false
    }

    componentDidMount () {
        this.setState({
            visible: true
        })
        setTimeout(() => {
            this.setState({
                visible: false
            })
            this.props.onClose()
        }, this.props.duration)
    }

    render () {
        const { removeComponent, icon, content } = this.props
        return (
        <div className={classnames('message', { 'message-show': this.state.visible })} onTransitionEnd={() => !this.state.visible && removeComponent()}>
            {icon}
            {content}
        </div>
        )
    }
}

function notice (args: ArgsProps) {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const removeComponent = () => {
        const isUnMount = unmountComponentAtNode(container)
        if (isUnMount) {
            document.body.removeChild(container)
        }
    }
    const icon = <Icon type={args.type} size={26}></Icon>
    const props: MessageProps = {
        icon,
        content: args.content,
        removeComponent,
        duration: args.duration,
        onClose: args.onClose
    }

    render(<Message {...props} />, container)
}
export interface MessageApi {
    info (content: string, type: NoticeType, duration?: number, onClose?: ConfigOnClose)
}

const api: any = {
}
const types = ['success', 'info', 'warning', 'error']
types.forEach(type => {
    api[type] = (content: string, type: NoticeType, duration?: number, onClose?: ConfigOnClose) => notice({
        content, duration, type, onClose
    })
})

export default api as MessageApi
