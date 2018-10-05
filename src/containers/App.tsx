import * as React from 'react'
import { Route } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { I18nProps } from '@models'
import './App.scss'

import Overview from '@containers/Overview'
import Proxies from '@containers/Proxies'
import Logs from '@containers/Logs'
import Rules from '@containers/Rules'
import Settings from '@containers/Settings'
import SlideBar from '@containers/Sidebar'

export interface AppProps extends I18nProps {
}

@hot(module)
export default class App extends React.Component<AppProps, {}> {
    render () {
        const routes = [
            { path: '/', name: 'Overview', component: Overview, exact: true },
            { path: '/proxies', name: 'Proxies', component: Proxies },
            { path: '/logs', name: 'Logs', component: Logs },
            { path: '/rules', name: 'Rules', component: Rules },
            { path: '/settings', name: 'Settings', component: Settings }
        ]

        return (
            <div className="app">
                <SlideBar routes={routes} />
                <div className="page-container">
                    {
                        routes.map(
                            route => <Route exact={!!route.exact} path={route.path} component={route.component}/>
                        )
                    }
                </div>
            </div>
        )
    }
}
