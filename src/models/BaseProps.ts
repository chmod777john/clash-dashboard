import { type CSSProperties, type ReactNode } from 'react'

export interface BaseComponentProps {
    className?: string
    children?: ReactNode
    style?: CSSProperties
}
