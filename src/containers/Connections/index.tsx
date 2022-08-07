import { useIntersectionObserver, useSyncedRef, useUnmountEffect } from '@react-hookz/web/esm'
import { useReactTable, getSortedRowModel, getFilteredRowModel, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import classnames from 'classnames'
import { groupBy } from 'lodash-es'
import { useMemo, useLayoutEffect, useRef, useState, useEffect } from 'react'

import { Header, Checkbox, Modal, Icon, Drawer, Card, Button } from '@components'
import { fromNow } from '@lib/date'
import { basePath, formatTraffic } from '@lib/helper'
import { useObject, useVisible } from '@lib/hook'
import * as API from '@lib/request'
import { useClient, useConnectionStreamReader, useI18n } from '@stores'

import { Devices } from './Devices'
import { ConnectionInfo } from './Info'
import { Connection, FormatConnection, useConnections } from './store'
import './style.scss'

const Columns = {
    Host: 'host',
    Network: 'network',
    Process: 'process',
    Type: 'type',
    Chains: 'chains',
    Rule: 'rule',
    Speed: 'speed',
    Upload: 'upload',
    Download: 'download',
    SourceIP: 'sourceIP',
    Time: 'time',
} as const

const shouldCenter = new Set<string>([Columns.Network, Columns.Type, Columns.Speed, Columns.Upload, Columns.Download, Columns.SourceIP, Columns.Time, Columns.Process])

function formatSpeed (upload: number, download: number) {
    switch (true) {
        case upload === 0 && download === 0:
            return '-'
        case upload !== 0 && download !== 0:
            return `↑ ${formatTraffic(upload)}/s ↓ ${formatTraffic(download)}/s`
        case upload !== 0:
            return `↑ ${formatTraffic(upload)}/s`
        default:
            return `↓ ${formatTraffic(download)}/s`
    }
}

const columnHelper = createColumnHelper<FormatConnection>()

export default function Connections () {
    const { translation, lang } = useI18n()
    const t = useMemo(() => translation('Connections').t, [translation])
    const connStreamReader = useConnectionStreamReader()
    const readerRef = useSyncedRef(connStreamReader)
    const client = useClient()
    const cardRef = useRef<HTMLDivElement>(null)

    // total
    const [traffic, setTraffic] = useObject({
        uploadTotal: 0,
        downloadTotal: 0,
    })

    // close all connections
    const { visible, show, hide } = useVisible()
    function handleCloseConnections () {
        client.closeAllConnections().finally(() => hide())
    }

    // connections
    const { connections, feed, save, toggleSave } = useConnections()
    const data: FormatConnection[] = useMemo(() => connections.map(
        c => ({
            id: c.id,
            host: `${c.metadata.host || c.metadata.destinationIP}:${c.metadata.destinationPort}`,
            chains: c.chains.slice().reverse().join(' / '),
            rule: c.rulePayload ? `${c.rule} :: ${c.rulePayload}` : c.rule,
            time: new Date(c.start).getTime(),
            upload: c.upload,
            download: c.download,
            sourceIP: c.metadata.sourceIP,
            type: c.metadata.type,
            network: c.metadata.network.toUpperCase(),
            process: c.metadata.processPath,
            speed: { upload: c.uploadSpeed, download: c.downloadSpeed },
            completed: !!c.completed,
            original: c,
        }),
    ), [connections])
    const devices = useMemo(() => {
        const gb = groupBy(connections, 'metadata.sourceIP')
        return Object.keys(gb)
            .map(key => ({ label: key, number: gb[key].length }))
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [connections])

    // table
    const pinRef = useRef<HTMLTableCellElement>(null)
    const intersection = useIntersectionObserver(pinRef, { threshold: [1] })
    const columns = useMemo(
        () => [
            columnHelper.accessor(Columns.Host, { minSize: 260, size: 260, header: t(`columns.${Columns.Host}`) }),
            columnHelper.accessor(Columns.Network, { minSize: 80, size: 80, header: t(`columns.${Columns.Network}`) }),
            columnHelper.accessor(Columns.Type, { minSize: 100, size: 100, header: t(`columns.${Columns.Type}`) }),
            columnHelper.accessor(Columns.Chains, { minSize: 200, size: 200, header: t(`columns.${Columns.Chains}`) }),
            columnHelper.accessor(Columns.Rule, { minSize: 140, size: 140, header: t(`columns.${Columns.Rule}`) }),
            columnHelper.accessor(Columns.Process, { minSize: 100, size: 100, header: t(`columns.${Columns.Process}`), cell: cell => cell.getValue() ? basePath(cell.getValue()!) : '-' }),
            columnHelper.accessor(
                row => [row.speed.upload, row.speed.download],
                {
                    id: Columns.Speed,
                    header: t(`columns.${Columns.Speed}`),
                    minSize: 200,
                    size: 200,
                    sortDescFirst: true,
                    sortingFn (rowA, rowB) {
                        const speedA = rowA.original?.speed ?? { upload: 0, download: 0 }
                        const speedB = rowB.original?.speed ?? { upload: 0, download: 0 }
                        return speedA.download === speedB.download
                            ? speedA.upload - speedB.upload
                            : speedA.download - speedB.download
                    },
                    cell: cell => formatSpeed(cell.getValue()[0], cell.getValue()[1]),
                },
            ),
            columnHelper.accessor(Columns.Upload, { minSize: 100, size: 100, header: t(`columns.${Columns.Upload}`), cell: cell => formatTraffic(cell.getValue()) }),
            columnHelper.accessor(Columns.Download, { minSize: 100, size: 100, header: t(`columns.${Columns.Download}`), cell: cell => formatTraffic(cell.getValue()) }),
            columnHelper.accessor(Columns.SourceIP, { minSize: 140, size: 140, header: t(`columns.${Columns.SourceIP}`), filterFn: 'equals' }),
            columnHelper.accessor(
                Columns.Time,
                {
                    minSize: 120,
                    size: 120,
                    header: t(`columns.${Columns.Time}`),
                    cell: cell => fromNow(new Date(cell.getValue()), lang),
                    sortingFn: (rowA, rowB) => (rowB.original?.time ?? 0) - (rowA.original?.time ?? 0),
                },
            ),
        ],
        [lang, t],
    )

    useLayoutEffect(() => {
        function handleConnection (snapshots: API.Snapshot[]) {
            for (const snapshot of snapshots) {
                setTraffic({
                    uploadTotal: snapshot.uploadTotal,
                    downloadTotal: snapshot.downloadTotal,
                })

                feed(snapshot.connections)
            }
        }

        connStreamReader?.subscribe('data', handleConnection)
        return () => {
            connStreamReader?.unsubscribe('data', handleConnection)
        }
    }, [connStreamReader, feed, setTraffic])
    useUnmountEffect(() => {
        readerRef.current?.destory()
    })

    const instance = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            sorting: [{ id: Columns.Time, desc: false }],
        },
        columnResizeMode: 'onChange',
        enableColumnResizing: true,
    })

    const headerGroup = instance.getHeaderGroups()[0]

    // filter
    const [device, setDevice] = useState('')
    function handleDeviceSelected (label: string) {
        setDevice(label)
        instance.getColumn(Columns.SourceIP).setFilterValue(label || undefined)
    }

    // click item
    const [drawerState, setDrawerState] = useObject({
        visible: false,
        selectedID: '',
        connection: {} as Partial<Connection>,
    })
    function handleConnectionClosed () {
        setDrawerState(d => { d.connection.completed = true })
        client.closeConnection(drawerState.selectedID)
    }
    const latestConntion = useSyncedRef(drawerState.connection)
    useEffect(() => {
        const conn = data.find(c => c.id === drawerState.selectedID)?.original
        if (conn) {
            setDrawerState(d => {
                d.connection = { ...conn }
                if (drawerState.selectedID === latestConntion.current.id) {
                    d.connection.completed = latestConntion.current.completed
                }
            })
        } else if (Object.keys(latestConntion.current).length !== 0 && !latestConntion.current.completed) {
            setDrawerState(d => { d.connection.completed = true })
        }
    }, [data, drawerState.selectedID, latestConntion, setDrawerState])

    const scrolled = useMemo(() => (intersection?.intersectionRatio ?? 0) < 1, [intersection])
    const headers = headerGroup.headers.map((header, idx) => {
        const column = header.column
        const id = column.id
        return (
            <th
                className={classnames('connections-th', {
                    resizing: column.getIsResizing(),
                    fixed: column.id === Columns.Host,
                    shadow: scrolled && column.id === Columns.Host,
                })}
                style={{ width: header.getSize() }}
                ref={column.id === Columns.Host ? pinRef : undefined}
                key={id}>
                <div onClick={column.getToggleSortingHandler()}>
                    { flexRender(header.column.columnDef.header, header.getContext()) }
                    {
                        column.getIsSorted() !== false
                            ? column.getIsSorted() === 'desc' ? ' ↓' : ' ↑'
                            : null
                    }
                </div>
                { idx !== headerGroup.headers.length - 1 &&
                    <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="connections-resizer" />
                }
            </th>
        )
    })

    const content = instance.getRowModel().rows.map(row => {
        return (
            <tr
                className="cursor-default select-none"
                key={row.original?.id}
                onClick={() => setDrawerState({ visible: true, selectedID: row.original?.id })}>
                {
                    row.getAllCells().map(cell => {
                        const classname = classnames(
                            'connections-block',
                            { 'text-center': shouldCenter.has(cell.column.id), completed: row.original?.completed },
                            {
                                fixed: cell.column.id === Columns.Host,
                                shadow: scrolled && cell.column.id === Columns.Host,
                            },
                        )
                        return (
                            <td
                                className={classname}
                                style={{ width: cell.column.getSize() }}
                                key={cell.column.id}>
                                { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                            </td>
                        )
                    })
                }
            </tr>
        )
    })

    return (
        <div className="page !h-100vh">
            <Header title={t('title')}>
                <span className="connections-filter flex-1 cursor-default">
                    {`(${t('total.text')}: ${t('total.upload')} ${formatTraffic(traffic.uploadTotal)} ${t('total.download')} ${formatTraffic(traffic.downloadTotal)})`}
                </span>
                <Checkbox className="connections-filter" checked={save} onChange={toggleSave}>{t('keepClosed')}</Checkbox>
                <Icon className="connections-filter dangerous" onClick={show} type="close-all" size={20} />
            </Header>
            { devices.length > 1 && <Devices devices={devices} selected={device} onChange={handleDeviceSelected} /> }
            <Card ref={cardRef} className="connections-card relative">
                <div className="min-h-full min-w-full overflow-auto">
                    <table>
                        <thead>
                            <tr className="connections-header">
                                { headers }
                            </tr>
                        </thead>
                        <tbody>
                            { content }
                        </tbody>
                    </table>
                </div>
            </Card>
            <Modal title={t('closeAll.title')} show={visible} onClose={hide} onOk={handleCloseConnections}>{t('closeAll.content')}</Modal>
            <Drawer containerRef={cardRef} bodyClassName="flex flex-col" visible={drawerState.visible} width={450}>
                <div className="flex h-8 items-center justify-between">
                    <span className="pl-3 font-bold">{t('info.title')}</span>
                    <Icon type="close" size={16} className="cursor-pointer" onClick={() => setDrawerState('visible', false)} />
                </div>
                <ConnectionInfo className="mt-3 px-5" connection={drawerState.connection} />
                <div className="mt-3 flex justify-end pr-3">
                    <Button type="danger" disiabled={drawerState.connection.completed} onClick={() => handleConnectionClosed()}>{ t('info.closeConnection') }</Button>
                </div>
            </Drawer>
        </div>
    )
}
