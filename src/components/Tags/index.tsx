import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import { Icon } from '@components'
import classnames from 'classnames'
import './style.scss'

interface TagsProps extends BaseComponentProps {
    data: Set<string>
    showAdd: boolean
    onDelete: (tag: string) => void
    onAdd: () => void
}

export class Tags extends React.Component<TagsProps, {}> {
    static defaultProps: TagsProps = {
        data: new Set(),
        showAdd: true,
        onDelete: () => {},
        onAdd: () => {}
    }

    render () {
        const { className, data, onDelete, onAdd, showAdd } = this.props
        const tags = [...data]
            .sort()
            .map(t => (
                <li>
                    { t }
                    <Icon
                        className="tags-delete"
                        type="plus"
                        size={12}
                        style={{ fontWeight: 'bold', color: '#fff' }}
                        onClick={() => onDelete(t)}/>
                </li>
            ))

        return (
            <ul className={classnames('tags', className)}>
                { tags }
                {
                    showAdd &&
                    <li className="tags-add" onClick={onAdd}>
                        <Icon type="plus" size={12} style={{ fontWeight: 'bold', color: '#fff' }} />
                    </li>
                }
            </ul>
        )
    }
}
