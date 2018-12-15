import * as React from 'react'
import { inject } from 'mobx-react'
import { BaseComponentProps } from '@models'
import { ConfigStore } from '@stores'
import { changeProxySelected, Group as IGroup } from '@lib/request'
import { storeKeys } from '@lib/createStore'
import { Tags } from '@components'
import './style.scss'

interface GroupProps extends BaseComponentProps {
    config: IGroup
    store?: ConfigStore
}

@inject(...storeKeys)
export class Group extends React.Component<GroupProps, {}> {
    handleChangeProxySelected = async (name: string) => {
        await changeProxySelected(this.props.config.name, name)
        await this.props.store.fetchData()
    }

    render () {
        const { config } = this.props
        const proxies = new Set(config.all)
        return (
            <div className="proxy-group">
                <span className="proxy-group-name">{ config.name }</span>
                <span className="proxy-group-type">{ config.type }</span>
                <Tags className="proxy-group-tags" data={proxies} onClick={this.handleChangeProxySelected} selected={config.now} />
            </div>
        )
    }
}
