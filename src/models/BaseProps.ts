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
export interface BaseProps {
    styles?: any
    router?: RouterStore
    config?: ConfigStore
}
