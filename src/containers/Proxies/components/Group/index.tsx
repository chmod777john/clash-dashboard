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
            <div className="flex items-center justify-between h-10 md:h-15 md:mt-0 md:w-auto mt-4 w-full">
                <span className="px-5 h-6 md:w-30 overflow-ellipsis overflow-hidden w-35 whitespace-nowrap">{ config.name }</span>
                <Tag className="md:mr-0 mr-5">{ config.type }</Tag>
            </div>
            <div className="flex-1 md:py-4 py-2">
                <Tags
                    className="md:ml-8 ml-5"
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
