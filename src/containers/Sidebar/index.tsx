import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'

import './style.scss'
const logo = require('@assets/logo.png')

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
    const { t } = useTranslation(['SideBar'])

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
