import React, { useLayoutEffect, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useI18n } from '@stores'
import { Card, Header } from '@components'
import { getLogsStreamReader } from '@lib/request'
import { StreamReader } from '@lib/streamer'
import { Log } from '@models/Log'
import './style.scss'

export default function Logs () {
    const listRef = useRef<HTMLUListElement>(null)
    const logsRef = useRef<Log[]>([])
    const [logs, setLogs] = useState<Log[]>([])
    const { translation } = useI18n()
    const { t } = translation('Logs')

    useLayoutEffect(() => {
        const ul = listRef.current
        if (ul) {
            ul.scrollTop = ul.scrollHeight
        }
    })

    useEffect(() => {
        let streamReader: StreamReader<Log> | null = null

        function handleLog (newLogs: Log[]) {
            logsRef.current = logsRef.current.slice().concat(newLogs.map(d => ({ ...d, time: new Date() })))
            setLogs(logsRef.current)
        }

        (async function () {
            streamReader = await getLogsStreamReader()
            logsRef.current = streamReader.buffer()
            setLogs(logsRef.current)
            streamReader.subscribe('data', handleLog)
        }())

        return () => streamReader?.unsubscribe('data', handleLog)
    }, [])

    return (
        <div className="page">
            <Header title={ t('title') } />
            <Card className="flex flex-col flex-1 mt-3">
                <ul className="logs-panel" ref={listRef}>
                    {
                        logs.map(
                            (log, index) => (
                                <li className="leading-5 inline-block" key={index}>
                                    <span className="mr-4 text-gray-400 text-opacity-90">{ dayjs(log.time).format('YYYY-MM-DD HH:mm:ss') }</span>
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
