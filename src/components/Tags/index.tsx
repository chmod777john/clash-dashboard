import * as React from 'react'
import { BaseComponentProps } from '@models/BaseProps'
import classnames from 'classnames'
import './style.scss'

interface TagsProps extends BaseComponentProps {
    data: Set<string>
    onClick: (name: string) => void
    select: string
    rowHeight: number
}

interface TagsState {
    extend: boolean
    showExtend: boolean
    ulRef: React.RefObject<HTMLUListElement>
}

export class Tags extends React.Component<TagsProps, TagsState> {
    state: TagsState = {
        extend: false,
        showExtend: true,
        ulRef: React.createRef<HTMLUListElement>()
    }

    toggleExtend = () => {
        this.setState({ extend: !this.state.extend })
    }

    componentDidMount () {
        this.setState({ showExtend: this.state.ulRef.current.offsetHeight > 30 })
    }

    render () {
        const { className, data, onClick, select } = this.props
        const { extend } = this.state
        const rowHeight = this.state.extend ? 'auto' : this.props.rowHeight

        const tags = [...data]
            .sort()
            .map(t => {
                const tagClass = classnames({ 'tags-selected': select === t })
                return (
                    <li className={tagClass} key={t} onClick={() => onClick(t)}>
                        { t }
                    </li>
                )
            })

        return (
            <div className={classnames('tags-container', className)} style={{ height: rowHeight }}>
                <ul ref={this.state.ulRef} className={classnames('tags', { extend })}>
                    { tags }
                </ul>
                {
                    this.state.showExtend &&
                    <span className="tags-entend" onClick={this.toggleExtend}>{ this.state.extend ? '收起' : '展开' }</span>
                }
            </div>
        )
    }
}
