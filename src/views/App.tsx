import * as React from 'react'
import { Route } from 'react-router-dom'
import { I18nProps } from '@i18n'
import './App.scss'

import Overview from '@views/Overview'
import Proxies from '@views/Proxies'
import Logs from '@views/Logs'
import Rules from '@views/Rules'
import Settings from '@views/Settings'

import SlideBar from '@containers/Sidebar'

export interface AppProps extends I18nProps {
}

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
            <div className='app'>
                <SlideBar routes={routes} />
                <div>
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
