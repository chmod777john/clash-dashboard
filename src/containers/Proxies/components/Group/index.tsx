import * as React from 'react'
import { Data } from '@stores'
import { changeProxySelected, Group as IGroup } from '@lib/request'
import { Tags } from '@components'
import './style.scss'

interface GroupProps {
    config: IGroup
}

export function Group (props: GroupProps) {
    const { fetch } = Data.useContainer()
    const { config } = props

    async function handleChangeProxySelected (name: string) {
        await changeProxySelected(props.config.name, name)
        await fetch()
    }

    const canClick = config.type === 'Selector'
    return (
        <div className="proxy-group">
            <div className="proxy-group-part">
                <span className="proxy-group-name">{ config.name }</span>
                <span className="proxy-group-type">{ config.type }</span>
            </div>
            <div className="proxy-group-tags-container">
                <Tags
                    className="proxy-group-tags"
                    data={config.all}
                    onClick={handleChangeProxySelected}
                    select={config.now}
                    canClick={canClick}
                    rowHeight={30} />
            </div>
        </div>
    )
}
