import React, { useMemo, useLayoutEffect, useCallback, useRef, useState } from 'react'
import { Cell, Column, ColumnInstance, TableInstance, TableOptions, useBlockLayout, useFilters, UseFiltersInstanceProps, UseFiltersOptions, useResizeColumns, UseResizeColumnsColumnProps, UseResizeColumnsOptions, useSortBy, UseSortByColumnOptions, UseSortByColumnProps, UseSortByOptions, useTable } from 'react-table'
import classnames from 'classnames'
import { useScroll } from 'react-use'
import { groupBy } from 'lodash'
import { Header, Card, Checkbox, Modal, Icon } from '@components'
import { useI18n } from '@stores'
import * as API from '@lib/request'
import { StreamReader } from '@lib/streamer'
import { useObject, useVisible } from '@lib/hook'
import { fromNow } from '@lib/date'
import { RuleType } from '@models'
import { Devices } from './Devices'
import { useConnections } from './store'
import './style.scss'

enum Columns {
    Host = 'host',
    Network = 'network',
    Type = 'type',
    Chains = 'chains',
    Rule = 'rule',
    Speed = 'speed',
    Upload = 'upload',
    Download = 'download',
    SourceIP = 'sourceIP',
    Time = 'time'
}

const shouldCenter = new Set<string>([Columns.Network, Columns.Type, Columns.Rule, Columns.Speed, Columns.Upload, Columns.Download, Columns.SourceIP, Columns.Time])

interface TableColumn<D extends object = {}> extends
    ColumnInstance<D>,
    UseSortByColumnProps<D>,
    UseResizeColumnsColumnProps<D> {}

type TableColumnOption<D extends object = {}> =
    Column<D> &
    UseResizeColumnsOptions<D> &
    UseSortByColumnOptions<D>

interface ITableOptions<D extends object = {}> extends
    TableOptions<D>,
    UseSortByOptions<D>,
    UseFiltersOptions<D> {}

interface ITableInstance<D extends object = {}> extends
    TableInstance<D>,
    UseFiltersInstanceProps<D> {}

function formatTraffic(num: number) {
    const s = ['B', 'KB', 'MB', 'GB', 'TB']
    let idx = 0
    while (~~(num / 1024) && idx < s.length) {
        num /= 1024
        idx++
    }

    return `${idx === 0 ? num : num.toFixed(2)} ${s[idx]}`
}

function formatSpeed(upload: number, download: number) {
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

interface formatConnection {
    id: string
    host: string
    chains: string
    rule: string
    time: number
    upload: number
    download: number
    type: string
    network: string
    sourceIP: string
    speed: {
        upload: number
        download: number
    }
    completed: boolean
}

export default function Connections() {
    const { translation, lang } = useI18n()
    const t = useMemo(() => translation('Connections').t, [translation])

    // total
    const [traffic, setTraffic] = useObject({
        uploadTotal: 0,
        downloadTotal: 0
    })

    // close all connections
    const { visible, show, hide } = useVisible()
    function handleCloseConnections() {
        API.closeAllConnections().finally(() => hide())
    }

    // connections
    const { connections, feed, save, toggleSave } = useConnections()
    const data: formatConnection[] = useMemo(() => connections.map(
        c => ({
            id: c.id,
            host: `${c.metadata.host || c.metadata.destinationIP}:${c.metadata.destinationPort}`,
            chains: c.chains.slice().reverse().join(' / '),
            rule: c.rule === RuleType.RuleSet ? `${c.rule}(${c.rulePayload})` : c.rule,
            time: new Date(c.start).getTime(),
            upload: c.upload,
            download: c.download,
            sourceIP: c.metadata.sourceIP,
            type: c.metadata.type,
            network: c.metadata.network.toUpperCase(),
            speed: { upload: c.uploadSpeed, download: c.downloadSpeed },
            completed: !!c.completed
        })
    ), [connections])
    const devices = useMemo(() => {
        const gb = groupBy(connections, 'metadata.sourceIP')
        return Object.keys(gb).map(key => ({ label: key, number: gb[key].length })).sort((a, b) => a.label.localeCompare(b.label))
    }, [connections])

    // table
    const tableRef = useRef<HTMLDivElement>(null)
    const { x: scrollX } = useScroll(tableRef)
    const columns: TableColumnOption<formatConnection>[] = useMemo(() => [
        { Header: t(`columns.${Columns.Host}`), accessor: Columns.Host, minWidth: 260, width: 260 },
        { Header: t(`columns.${Columns.Network}`), accessor: Columns.Network, minWidth: 80, width: 80 },
        { Header: t(`columns.${Columns.Type}`), accessor: Columns.Type, minWidth: 120, width: 120 },
        { Header: t(`columns.${Columns.Chains}`), accessor: Columns.Chains, minWidth: 200, width: 200 },
        { Header: t(`columns.${Columns.Rule}`), accessor: Columns.Rule, minWidth: 140, width: 140 },
        {
            id: Columns.Speed,
            Header: t(`columns.${Columns.Speed}`),
            accessor(originalRow: formatConnection) {
                return [originalRow.speed.upload, originalRow.speed.download]
            },
            sortType(rowA, rowB) {
                const speedA = rowA.original.speed
                const speedB = rowB.original.speed
                return speedA.download === speedB.download
                    ? speedA.upload - speedB.upload
                    : speedA.download - speedB.download
            },
            minWidth: 200, width: 200,
            sortDescFirst: true
        },
        { Header: t(`columns.${Columns.Upload}`), accessor: Columns.Upload, minWidth: 100, width: 100, sortDescFirst: true },
        { Header: t(`columns.${Columns.Download}`), accessor: Columns.Download, minWidth: 100, width: 100, sortDescFirst: true },
        { Header: t(`columns.${Columns.SourceIP}`), accessor: Columns.SourceIP, minWidth: 140, width: 140 },
        { Header: t(`columns.${Columns.Time}`), accessor: Columns.Time, minWidth: 120, width: 120, sortType(rowA, rowB) { return rowB.original.time - rowA.original.time } },
    ] as TableColumnOption<formatConnection>[], [t])

    useLayoutEffect(() => {
        let streamReader: StreamReader<API.Snapshot> | null = null

        function handleConnection(snapshots: API.Snapshot[]) {
            for (const snapshot of snapshots) {
                setTraffic({
                    uploadTotal: snapshot.uploadTotal,
                    downloadTotal: snapshot.downloadTotal
                })

                feed(snapshot.connections)
            }
        }

        (async function () {
            streamReader = await API.getConnectionStreamReader()
            streamReader.subscribe('data', handleConnection)
        }())

        return () => {
            if (streamReader) {
                streamReader.unsubscribe('data', handleConnection)
                streamReader.destory()
            }
        }
    }, [feed, setTraffic])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter
    } = useTable(
        {
            columns,
            data,
            autoResetSortBy: false,
            autoResetFilters: false,
            initialState: { sortBy: [{ id: Columns.Time, desc: false }] }
        } as ITableOptions<formatConnection>,
        useResizeColumns,
        useBlockLayout,
        useFilters,
        useSortBy
    ) as ITableInstance<formatConnection>
    const headerGroup = useMemo(() => headerGroups[0], [headerGroups])
    const renderCell = useCallback(function (cell: Cell<formatConnection>) {
        switch (cell.column.id) {
            case Columns.Speed:
                return formatSpeed(cell.value[0], cell.value[1])
            case Columns.Upload:
            case Columns.Download:
                return formatTraffic(cell.value)
            case Columns.Time:
                return fromNow(new Date(cell.value), lang)
            default:
                return cell.value
        }
    }, [lang])

    // filter
    const [device, setDevice] = useState('')
    function handleDeviceSelected (label: string) {
        setDevice(label)
        setFilter?.(Columns.SourceIP, label)
    }

    return (
        <div className="page">
            <Header title={t('title')}>
                <span className="connections-filter total">
                    {`(${t('total.text')}: ${t('total.upload')} ${formatTraffic(traffic.uploadTotal)} ${t('total.download')} ${formatTraffic(traffic.downloadTotal)})`}
                </span>
                <Checkbox className="connections-filter" checked={save} onChange={toggleSave}>{t('keepClosed')}</Checkbox>
                <Icon className="connections-filter dangerous" onClick={show} type="close-all" size={20} />
            </Header>
            { devices.length > 1 && <Devices devices={devices} selected={device} onChange={handleDeviceSelected} /> }
            <Card className="connections-card">
                <div {...getTableProps()} className="connections" ref={tableRef}>
                    <div {...headerGroup.getHeaderGroupProps()} className="connections-header">
                        {
                            headerGroup.headers.map((column, idx) => {
                                const realColumn = column as unknown as TableColumn<formatConnection>
                                const id = realColumn.id
                                return (
                                    <div
                                        {...realColumn.getHeaderProps()}
                                        className={classnames('connections-th', {
                                            resizing: realColumn.isResizing,
                                            fixed: scrollX !== 0 && realColumn.id === Columns.Host
                                        })}
                                        key={id}>
                                        <div {...realColumn.getSortByToggleProps()}>
                                            {column.render('Header')}
                                            {
                                                realColumn.isSorted
                                                    ? realColumn.isSortedDesc ? ' ↓' : ' ↑'
                                                    : null
                                            }
                                        </div>
                                        { idx !== headerGroup.headers.length - 1 &&
                                            <div {...realColumn.getResizerProps()} className="connections-resizer" />
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div {...getTableBodyProps()} className="connections-body">
                        {
                            rows.map(row => {
                                prepareRow(row)
                                return (
                                    <div {...row.getRowProps()} className="connections-item" key={row.original.id}>
                                        {
                                            row.cells.map(cell => {
                                                const classname = classnames(
                                                    'connections-block',
                                                    { center: shouldCenter.has(cell.column.id), completed: row.original.completed },
                                                    { fixed: scrollX !== 0 && cell.column.id === Columns.Host }
                                                )
                                                return (
                                                    <div {...cell.getCellProps()} className={classname} key={cell.column.id}>
                                                        { renderCell(cell)}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Card>
            <Modal title={t('closeAll.title')} show={visible} onClose={hide} onOk={handleCloseConnections}>{t('closeAll.content')}</Modal>
        </div>
    )
}
