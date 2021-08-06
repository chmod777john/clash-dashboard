import classnames from 'classnames'
import React from 'react'

import { BaseComponentProps } from '@models/BaseProps'

import { Spinner } from './Spinner'
import './style.scss'

interface LoadingProps extends BaseComponentProps {
    visible: boolean
    spinnerClassName?: string
}

export function Loading (props: LoadingProps) {
    const classname = classnames('loading', 'visible', props.className)
    return props.visible
        ? (
            <div className={classname}>
                <Spinner className={props.spinnerClassName} />
            </div>
        )
        : null
}
