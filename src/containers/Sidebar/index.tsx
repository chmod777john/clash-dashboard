import classnames from 'classnames'
import * as React from 'react'
import { NavLink } from 'react-router-dom'

import logo from '@assets/logo.png'
import { useI18n, useVersion, useClashXData } from '@stores'
import './style.scss'

interface SidebarProps {
    routes: Array<{
        path: string
        name: string
        noMobile?: boolean
        exact?: boolean
    }>
}

export default function Sidebar (props: SidebarProps) {
    const { routes } = props
    const { translation } = useI18n()
    const { version, premium } = useVersion()
    const { data } = useClashXData()
    const { t } = translation('SideBar')

    const navlinks = routes.map(
        ({ path, name, exact, noMobile }) => (
            <li className={classnames('item', { 'no-mobile': noMobile })} key={name}>
                <NavLink to={path} activeClassName="active" exact={!!exact}>{ t(name) }</NavLink>
            </li>
        ),
    )

    return (
        <div className="sidebar">
            <img src={logo} alt="logo" className="sidebar-logo" />
            <ul className="sidebar-menu">
                { navlinks }
            </ul>
            <div className="sidebar-version">
                <span className="sidebar-version-label">Clash{ data?.isClashX && 'X' } { t('Version') }</span>
                <span className="sidebar-version-text">{ version }</span>
                { premium && <span className="sidebar-version-label">Premium</span> }
            </div>
        </div>
    )
}
