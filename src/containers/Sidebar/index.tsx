import * as React from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { useI18n, useVersion, useClashXData } from '@stores'

import './style.scss'
import logo from '@assets/logo.png'
import useSWR from 'swr'

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
    const { useTranslation } = useI18n()
    const { version, premium, update } = useVersion()
    const { data: { isClashX }, update: updateClashXData } = useClashXData()
    const { t } = useTranslation('SideBar')

    useSWR('version', update)
    useSWR('clashx', updateClashXData)

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
            <div className="sidebar-version">
                <span className="sidebar-version-label">Clash{ isClashX && 'X' } { t('Version') }</span>
                <span className="sidebar-version-text">{ version }</span>
                { premium && <span className="sidebar-version-label">Premium</span> }
            </div>
        </div>
    )
}
