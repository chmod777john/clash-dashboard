import React from 'react'
import classnames from 'classnames'
import { BaseComponentProps } from '@models/BaseProps'
import { Spinner } from './Spinner'

import './style.scss'

interface LoadingProps extends BaseComponentProps {
    visible: boolean
}

export function Loading (props: LoadingProps) {
    const classname = classnames('loading', 'visible')
    return props.visible
        ? (
            <div className={classname}>
                <Spinner />
            </div>
        )
        : null
}
