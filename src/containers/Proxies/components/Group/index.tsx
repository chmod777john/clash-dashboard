import { useAtom } from 'jotai'
import { useMemo } from 'react'

import { Tags, Tag } from '@components'
import { type Group as IGroup } from '@lib/request'
import { useProxy, useConfig, proxyMapping, useClient } from '@stores'

import './style.scss'

interface GroupProps {
    config: IGroup
}

export function Group (props: GroupProps) {
    const { markProxySelected } = useProxy()
    const [proxyMap] = useAtom(proxyMapping)
    const { data: Config } = useConfig()
    const client = useClient()
    const { config } = props

    async function handleChangeProxySelected (name: string) {
        await client.changeProxySelected(props.config.name, name)
        markProxySelected(props.config.name, name)
        if (Config.breakConnections) {
            const list: string[] = []
            const snapshot = await client.getConnections()
            for (const connection of snapshot.data.connections) {
                if (connection.chains.includes(props.config.name)) {
                    list.push(connection.id)
                }
            }

            await Promise.all(list.map(id => client.closeConnection(id)))
        }
    }

    const errSet = useMemo(() => {
        const set = new Set<string>()
        for (const proxy of config.all) {
            const history = proxyMap.get(proxy)?.history
            if (history?.length && history.slice(-1)[0].delay === 0) {
                set.add(proxy)
            }
        }

        return set
    }, [config.all, proxyMap])

    const canClick = config.type === 'Selector'
    return (
        <div className="proxy-group">
            <div className="mt-4 h-10 w-full flex items-center justify-between md:mt-0 md:h-15 md:w-auto">
                <span className="overflow-ellipsis h-6 w-35 overflow-hidden whitespace-nowrap px-5 md:w-30">{ config.name }</span>
                <Tag className="mr-5 md:mr-0">{ config.type }</Tag>
            </div>
            <div className="flex-1 py-2 md:py-4">
                <Tags
                    className="ml-5 md:ml-8"
                    data={config.all}
                    onClick={handleChangeProxySelected}
                    errSet={errSet}
                    select={config.now}
                    canClick={canClick}
                    rowHeight={30} />
            </div>
        </div>
    )
}
