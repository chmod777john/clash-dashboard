import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import classnames from 'classnames'
import './style.scss'

interface HeaderProps extends BaseComponentProps {
    // header title
    title: string
}

export class Header extends React.Component<HeaderProps, {}> {
    render () {
        const { title, children, className, style } = this.props

        return <header className={classnames('header', className)} style={style}>
            <h1>{title}</h1>
            <div className="operations">{children}</div>
        </header>
    }
}
