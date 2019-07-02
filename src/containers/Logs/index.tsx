import * as React from 'react'
import dayjs from 'dayjs'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Card, Header } from '@components'
import './style.scss'
import { getLogsStreamReader } from '@lib/request'

interface Log {
    type: string
    payload: string,
    time: Date
}

interface LogsProps extends WithTranslation {}

interface LogsState {
    logs: Log[]
}

class Logs extends React.Component<LogsProps, LogsState> {
    state: LogsState = {
        logs: []
    }

    private streamReader = null
    private listRef = React.createRef<HTMLUListElement>()
    async componentDidMount () {
        this.streamReader = await getLogsStreamReader()
        let logs = this.streamReader.buffer()
        this.setState({ logs }, () => this.scrollToBottom())
        this.streamReader.subscribe('data', (data) => {
            logs = [].concat(this.state.logs, data.map(d => ({ ...d, time: new Date() })))
            this.setState({ logs }, () => this.scrollToBottom())
        })
    }

    scrollToBottom = () => {
        const ul = this.listRef.current
        ul.scrollTop = ul.scrollHeight
    }

    render () {
        const { t } = this.props
        return (
            <div className="page">
                <Header title={ t('title') } />
                <Card className="logs-card">
                    <ul className="logs-panel" ref={this.listRef}>
                        {
                            this.state.logs.map(
                                (log, index) => (
                                    <li key={index}>
                                        <span className="logs-panel-time">{ dayjs(log.time).format('YYYY-MM-DD HH:mm:ss') }</span>
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

export default withTranslation(['Logs'])(Logs)
