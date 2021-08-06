import dayjs from 'dayjs'
import React, { useLayoutEffect, useEffect, useRef, useState } from 'react'

import { Card, Header } from '@components'
import { Log } from '@models/Log'
import { useI18n, useLogsStreamReader } from '@stores'

import './style.scss'

export default function Logs () {
    const listRef = useRef<HTMLUListElement>(null)
    const logsRef = useRef<Log[]>([])
    const [logs, setLogs] = useState<Log[]>([])
    const { translation } = useI18n()
    const { t } = translation('Logs')
    const logsStreamReader = useLogsStreamReader()

    useLayoutEffect(() => {
        const ul = listRef.current
        if (ul != null) {
            ul.scrollTop = ul.scrollHeight
        }
    })

    useEffect(() => {
        function handleLog (newLogs: Log[]) {
            logsRef.current = logsRef.current.slice().concat(newLogs.map(d => ({ ...d, time: new Date() })))
            setLogs(logsRef.current)
        }

        if (logsStreamReader != null) {
            logsStreamReader.subscribe('data', handleLog)
            logsRef.current = logsStreamReader.buffer()
            setLogs(logsRef.current)
        }

        return () => logsStreamReader?.unsubscribe('data', handleLog)
    }, [logsStreamReader])

    return (
        <div className="page">
            <Header title={ t('title') } />
            <Card className="flex flex-col flex-1 mt-2.5 md:mt-4">
                <ul className="logs-panel" ref={listRef}>
                    {
                        logs.map(
                            (log, index) => (
                                <li className="leading-5 inline-block" key={index}>
                                    <span className="mr-4 text-gray-400 text-opacity-90">{ dayjs(log.time).format('YYYY-MM-DD HH:mm:ss') }</span>
                                    <span>[{ log.type }] { log.payload }</span>
                                </li>
                            ),
                        )
                    }
                </ul>
            </Card>
        </div>
    )
}
