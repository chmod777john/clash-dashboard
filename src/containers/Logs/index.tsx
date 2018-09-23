import * as React from 'react'
import { Card, Header } from '@components'
import './style.scss'

export default class Logs extends React.Component<{}, {}> {
    render () {
        return (
            <div className="page">
                <Header title="日志" />
                <Card className="logs-card" />
            </div>
        )
    }
}
