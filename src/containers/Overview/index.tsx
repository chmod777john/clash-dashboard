import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { storeKeys } from '@lib/createStore'
import { BaseRouterProps } from '@models'

@inject(...storeKeys)
@observer
export default class Overview extends React.Component<BaseRouterProps, {}> {

    componentDidMount () {
        // here can access stores
        console.log(this.props)
    }

    render () {
        return 'Overview'
    }
}
