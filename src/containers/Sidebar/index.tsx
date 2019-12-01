import * as React from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { containers } from '@stores'

import './style.scss'
import logo from '@assets/logo.png'

interface SidebarProps {
    routes: {
        path: string
        name: string
        noMobile?: boolean
        exact?: boolean
    }[]
}

export default function Sidebar (props: SidebarProps) {
    const { routes } = props
    const { useTranslation } = containers.useI18n()
    const { t } = useTranslation('SideBar')

    const navlinks = routes.map(
        ({ path, name, exact, noMobile }) => (
            <li className={classnames('item', { 'no-mobile': noMobile })} key={name}>
                <NavLink to={path} activeClassName="active" exact={!!exact}>{ t(name) }</NavLink>
            </li>
        )
    )

    return (
        <div className="sidebar">
            <img src={logo} className="sidebar-logo" />
            <ul className="sidebar-menu">
                { navlinks }
            </ul>
        </div>
    )
}
