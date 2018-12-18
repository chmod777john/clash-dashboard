import * as React from 'react'
import { translate } from 'react-i18next'
import { BaseComponentProps, I18nProps } from '@models'
import { noop } from '@lib/helper'
import classnames from 'classnames'
import './style.scss'

interface TagsProps extends BaseComponentProps, I18nProps {
    data: Set<string>
    onClick: (name: string) => void
    select: string
    rowHeight: number
    canClick: boolean
}

interface TagsState {
    expand: boolean
    showExtend: boolean
    ulRef: React.RefObject<HTMLUListElement>
}

class TagsClass extends React.Component<TagsProps, TagsState> {
    state: TagsState = {
        expand: false,
        showExtend: true,
        ulRef: React.createRef<HTMLUListElement>()
    }

    toggleExtend = () => {
        this.setState({ expand: !this.state.expand })
    }

    componentDidMount () {
        this.setState({ showExtend: this.state.ulRef.current.offsetHeight > 30 })
    }

    render () {
        const { t, className, data, onClick, select, canClick } = this.props
        const { expand } = this.state
        const rowHeight = this.state.expand ? 'auto' : this.props.rowHeight
        const handleClick = canClick ? onClick : noop

        const tags = [...data]
            .sort()
            .map(t => {
                const tagClass = classnames({ 'tags-selected': select === t, 'can-click': canClick })
                return (
                    <li className={tagClass} key={t} onClick={() => handleClick(t)}>
                        { t }
                    </li>
                )
            })

        return (
            <div className={classnames('tags-container', className)} style={{ height: rowHeight }}>
                <ul ref={this.state.ulRef} className={classnames('tags', { expand })}>
                    { tags }
                </ul>
                {
                    this.state.showExtend &&
                    <span className="tags-expand" onClick={this.toggleExtend}>{ this.state.expand ? t('collapseText') : t('expandText') }</span>
                }
            </div>
        )
    }
}

export const Tags = translate(['Proxies'])(TagsClass)
