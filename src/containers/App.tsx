import React, { useEffect } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import classnames from 'classnames'
import { isClashX } from '@lib/jsBridge'

// import Overview from '@containers/Overview'
import Proxies from '@containers/Proxies'
import Logs from '@containers/Logs'
import Rules from '@containers/Rules'
import Settings from '@containers/Settings'
import SlideBar from '@containers/Sidebar'
import Connections from '@containers/Connections'
import ExternalControllerModal from '@containers/ExternalControllerDrawer'
import { getLogsStreamReader } from '@lib/request'

import '../styles/common.scss'
import '../styles/iconfont.scss'

export default function App () {
    useEffect(() => {
        getLogsStreamReader()
    }, [])

    const routes = [
    // { path: '/', name: 'Overview', component: Overview, exact: true },
        { path: '/proxies', name: 'Proxies', component: Proxies },
        { path: '/logs', name: 'Logs', component: Logs },
        { path: '/rules', name: 'Rules', component: Rules, noMobile: true },
        { path: '/connections', name: 'Connections', component: Connections, noMobile: true },
        { path: '/settings', name: 'Settings', component: Settings }
    ]

    return (
        <div className={classnames('app', { 'not-clashx': !isClashX() })}>
            <SlideBar routes={routes} />
            <div className="page-container">
                <Switch>
                    <Route exact path="/" component={() => <Redirect to="/proxies"/>} />
                    {
                        routes.map(
                            route => <Route exact={false} path={route.path} key={route.path} component={route.component} />
                        )
                    }
                </Switch>
            </div>
            <ExternalControllerModal />
        </div>
    )
}
