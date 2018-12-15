import { CSSProperties } from 'react'
import { RouteComponentProps } from 'react-router'
import { RouterStore, ConfigStore } from '@stores'

/**
 * expose base router component props
 * and mobx store to props
 */
export interface BaseRouterProps extends RouteComponentProps<any>, BaseProps {}

/**
 * use when component is inject by mobx
 */
export interface BaseProps extends BaseComponentProps {
    styles?: any
    router?: RouterStore
    store?: ConfigStore
}

export interface BaseComponentProps {
    className?: string
    style?: CSSProperties
}
