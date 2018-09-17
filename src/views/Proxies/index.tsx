import * as React from 'react'

// containers
import ProxiesContainer from '@containers/Proxies'
import ProxyGroupContainer from '@containers/ProxyGroup'

const Proxies: React.SFC = () => (
    <div className="page">
        <ProxiesContainer />
        <ProxyGroupContainer />
    </div>
)

export default Proxies
