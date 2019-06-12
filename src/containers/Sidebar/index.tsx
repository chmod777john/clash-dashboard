import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { translate } from 'react-i18next'
import classnames from 'classnames'
import { I18nProps } from '@models'

import './style.scss'
const logo = require('@assets/logo.png')

interface SidebarProps extends I18nProps {
    routes: {
        path: string
        name: string
        noMobile?: boolean
        exact?: boolean
    }[]
}

class Sidebar extends React.Component<SidebarProps, {}> {
    render () {
        const { routes, t } = this.props
        return (
            <div className="sidebar">
                <img src={logo} className="sidebar-logo" />
                <ul className="sidebar-menu">
                    {
                        routes.map(
                            ({ path, name, exact, noMobile }) => (
                                <li className={classnames('item', { 'no-mobile': noMobile })} key={name}>
                                    <NavLink to={path} activeClassName="active" exact={!!exact}>{ t(name) }</NavLink>
                                </li>
                            )
                        )
                    }
                </ul>
            </div>
        )
    }
}

export default translate(['SideBar'])(Sidebar)
