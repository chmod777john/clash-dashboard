import * as React from 'react'

// containers
import ProxiesContainer from '@containers/Proxies'
import ProxyGroupContainer from '@containers/ProxyGroup'

export default class Proxies extends React.Component<{}, {}> {
    render () {
        return <div className="page">
            <ProxiesContainer />
            <ProxyGroupContainer />
        </div>
    }
}
