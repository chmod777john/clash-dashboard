import * as React from 'react'
import classnames from 'classnames'
import { createPortal } from 'react-dom'
import { BaseComponentProps } from '@models'
import { Button } from '@components'
import './style.scss'

const noop = () => {}

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

    // on click ok
    onOk?: typeof noop

    // on click close
    onClose?: typeof noop
}

export class Modal extends React.Component<ModalProps, {}> {

    static defaultProps: ModalProps = {
        show: true,
        title: 'Modal',
        size: 'small',
        footer: true,
        onOk: noop,
        onClose: noop
    }

    // portal container
    $container: Element

    $modal = React.createRef<HTMLDivElement>()

    constructor (props) {
        super(props)

        // create container element
        const container = document.createElement('div')
        document.body.appendChild(container)
        this.$container = container
    }

    componentWillUnmount () {
        document.body.removeChild(this.$container)
    }

    private handleMaskClick = (e) => {
        const { onClose } = this.props
        const el = this.$modal.current

        if (el && !el.contains(e.target)) {
            onClose()
        }
    }

    render () {
        const { show, size, title, footer, children, className, bodyClassName, style, bodyStyle, onOk, onClose } = this.props
        const modal = (
            <div
                className={classnames('modal-mask', { 'modal-show': show })}
                onClick={this.handleMaskClick}
            >
                <div
                    className={classnames('modal', `modal-${size}`, className)}
                    style={style}
                    ref={this.$modal}
                >
                    <div className="modal-title">{title}</div>
                    <div
                        className={classnames('modal-body', bodyClassName)}
                        style={bodyStyle}
                    >{children}</div>
                    {
                        footer && (
                            <div className="footer">
                                <Button onClick={() => onClose()}>取 消</Button>
                                <Button type="primary" onClick={() => onOk()}>确 定</Button>
                            </div>
                        )
                    }
                </div>
            </div>
        )

        return createPortal(modal, this.$container)
    }
}
