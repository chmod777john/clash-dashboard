import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import classnames from 'classnames'
import './style.scss'

interface TagsProps extends BaseComponentProps {
    data: Set<string>
    onClick: (name: string) => void
    selected: string
}

export class Tags extends React.Component<TagsProps, {}> {
    render () {
        const { className, data, onClick, selected } = this.props

        const tags = [...data]
        .sort()
        .map(t => {
            const tagClass = classnames({ 'tags-selected': selected === t })
            return (
                <li className={tagClass} key={t} onClick={() => onClick(t)}>
                    { t }
                </li>
            )
        })

        return (
            <ul className={classnames('tags', className)}>
                { tags }
            </ul>
        )
    }
}
