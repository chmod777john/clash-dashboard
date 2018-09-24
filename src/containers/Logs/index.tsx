import * as React from 'react'
import * as dayjs from 'dayjs'
import { Card, Header } from '@components'
import './style.scss'

interface LogsState {
    listHeight: number
}

export default class Logs extends React.Component<{}, LogsState> {
    state: LogsState = {
        listHeight: 0
    }

    componentDidMount () {
        this.setListHeight()
    }

    setListHeight = () => {
        this.setState({
            listHeight: document.querySelector('.logs-card').clientHeight - 30
        })
    }

    render () {
        const logs = [
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() },
            { type: 'info', payload: 'google.com match DomainSuffix using Proxy', timestamp: +new Date() }
        ]

        const listHeight = { height: this.state.listHeight }
        return (
            <div className="page">
                <Header title="日志" />
                <Card className="logs-card">
                    <ul className="logs-panel" style={listHeight}>
                        {
                            logs.map(
                                log => (
                                    <li>
                                        <span className="logs-panel-time">{ dayjs().format('YYYY-MM-DD HH:mm:ss') }</span>
                                        <span>[{ log.type }] { log.payload }</span>
                                    </li>
                                )
                            )
                        }
                    </ul>
                </Card>
            </div>
        )
    }
}
