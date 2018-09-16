import * as React from 'react'
import { Header } from '@components'

export default class ProxyGroup extends React.Component<{}, {}> {
    render () {
        return <div className="container">
            <Header title="策略组" />
        </div>
    }
}
