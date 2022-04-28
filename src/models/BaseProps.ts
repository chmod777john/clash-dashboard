import { CSSProperties, ReactNode } from 'react'

export interface BaseComponentProps {
    className?: string
    children?: ReactNode
    style?: CSSProperties
}
