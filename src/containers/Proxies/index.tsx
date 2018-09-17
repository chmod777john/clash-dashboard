import * as React from 'react'
import { Header, Icon } from '@components'

export default class Proxies extends React.Component<{}, {}> {
    render () {
        return <div className="container">
            <Header title="代理" >
                <Icon type="plus" size={20} style={{ fontWeight: 'bold' }} />
            </Header>
        </div>
    }
}
