import classnames from 'classnames'

import { type BaseComponentProps } from '@models/BaseProps'
import './style.scss'

interface HeaderProps extends BaseComponentProps {
    // header title
    title: string
}

export function Header (props: HeaderProps) {
    const { title, children, className, style } = props

    return <header className={classnames('header', className)} style={style}>
        <h1 className="md:text-xl">{title}</h1>
        <div className="flex flex-auto items-center justify-end">{children}</div>
    </header>
}
