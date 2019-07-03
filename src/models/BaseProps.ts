import { CSSProperties, ReactNode } from 'react'
import { RouteComponentProps } from 'react-router'

/**
 * expose base router component props
 * and mobx store to props
 */
export interface BaseRouterProps extends RouteComponentProps<any> {}

export interface BaseComponentProps {
    className?: string
    children?: ReactNode
    style?: CSSProperties
}
