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
                        onClick={this.handleChangeProxySelected}
                        select={config.now}
                        canClick={canClick}
                        rowHeight={30} />
                </div>
            </div>
        )
    }
}
