import * as React from 'react'
import * as dayjs from 'dayjs'
import { translate } from 'react-i18next'
import { I18nProps } from '@i18n'
import { Card, Header } from '@components'
import './style.scss'

interface Log {
    type: string
    payload: string,
    time: Date
}

interface LogsProps extends I18nProps {}

interface LogsState {
    listHeight: number
    logs: Log[]
}

class Logs extends React.Component<LogsProps, LogsState> {
    state: LogsState = {
        listHeight: 0,
        logs: []
    }

    private listRef = React.createRef<HTMLUListElement>()
    componentDidMount () {
        this.setListHeight()
        const logs: Log[] = Array.from(
            { length: 32 },
            () => ({ type: 'info', payload: 'google.com match DomainSuffix using Proxy', time: new Date() })
        )
        this.setState({ logs }, () => this.scrollToBottom())
    }

    setListHeight = () => {
        this.setState({
            listHeight: document.querySelector('.logs-card').clientHeight - 30
        })
    }

    scrollToBottom = () => {
        const ul = this.listRef.current
        ul.scrollTop = ul.scrollHeight
    }

    render () {
        const listHeight = { height: this.state.listHeight }
        const { t } = this.props
        return (
            <div className="page">
                <Header title={ t('title') } />
                <Card className="logs-card">
                    <ul className="logs-panel" style={listHeight} ref={this.listRef}>
                        {
                            this.state.logs.map(
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

export default translate(['Logs'])(Logs)
