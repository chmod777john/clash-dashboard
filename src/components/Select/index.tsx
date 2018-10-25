import * as React from 'react'
import classnames from 'classnames'
import { Icon } from '@components'
import { BaseComponentProps } from '@models'
import { createPortal } from 'react-dom'
import './style.scss'

type OptionValue = string | number

interface SelectProps extends BaseComponentProps {
    /**
     * selected value
     * must match one of options
     */
    value: OptionValue

    onSelect?: (value: OptionValue, e: React.MouseEvent<HTMLLIElement>) => void
}

interface SelectState {
    dropdownListStyles: React.CSSProperties
    showDropDownList: boolean,
    hasCreateDropList: boolean
}

export class Select extends React.Component<SelectProps, SelectState> {

    // portal container
    $container: Element

    // drop down list
    $attachment = React.createRef<HTMLDivElement>()

    // target position element
    $target = React.createRef<HTMLDivElement>()

    state = {
        dropdownListStyles: {},
        showDropDownList: false,
        hasCreateDropList: false
    }

    constructor (props) {
        super(props)
    }

    componentDidUpdate () {
        console.log('update')
    }

    componentDidMount () {

        document.addEventListener('click', this.handleGlobalClick, true)
        this.setState({ dropdownListStyles: this.calculateAttachmentPosition() })
    }

    componentWillUnmount () {
        if (this.state.hasCreateDropList) {
            document.body.removeChild(this.$container)
        }
        document.removeEventListener('click', this.handleGlobalClick, true)
    }
    shouldComponentUpdate (nextProps, nextState) {
        if (nextProps.value === this.props.value && nextState.showDropDownList === this.state.showDropDownList) {
            return false
        }
        return true
    }

    handleShowDropList = () => {
        if (!this.state.hasCreateDropList) {
            // create container element
            const container = document.createElement('div')
            document.body.appendChild(container)
            this.$container = container
            this.setState({
                hasCreateDropList: true
            })
        }
        this.setState({
            showDropDownList: true
        })
    }

    private handleGlobalClick = (e) => {
        const el = this.$attachment.current

        if (el && !el.contains(e.target)) {
            this.setState({ showDropDownList: false })
        }
    }

    private calculateAttachmentPosition () {
        const targetRectInfo = this.$target.current.getBoundingClientRect()

        return {
            top: Math.floor(targetRectInfo.top) - 10,
            left: Math.floor(targetRectInfo.left) - 10,
            width: Math.floor(targetRectInfo.width)
        }
    }

    private getSelectedOption = (value: OptionValue, children: React.ReactNode) => {
        let matchChild: React.ReactElement<any> = null

        React.Children.forEach(children, (child: React.ReactElement<any>) => {
            if (child.props && child.props.value === value) {
                matchChild = child
            }
        })

        return matchChild
    }

    private hookChildren = (
        children: React.ReactNode,
        value: OptionValue,
        onSelect: SelectProps['onSelect']
    ) => {
        return React.Children.map(children, (child: React.ReactElement<any>) => {
            if (!child.props || !child.type) {
                return child
            }

            // add classname for selected option
            const className = child.props.value === value
                ? classnames(child.props.className, 'selected')
                : child.props.className

            // hook element onclick event
            const rawOnClickEvent = child.props.onClick
            return React.cloneElement(child, Object.assign({}, child.props, {
                onClick: (e: React.MouseEvent<HTMLLIElement>) => {
                    onSelect(child.props.value, e)
                    this.setState({ showDropDownList: false })
                    rawOnClickEvent && rawOnClickEvent(e)
                },
                className
            }))
        })
    }

    render () {
        const { value, onSelect, children, className: cn, style } = this.props
        const { dropdownListStyles, showDropDownList, hasCreateDropList } = this.state
        const matchChild = this.getSelectedOption(value, children)
        const dropDownList = (
            <div
                className={classnames('select-list', { 'select-list-show': showDropDownList })}
                ref={this.$attachment}
                style={dropdownListStyles}
            >
                <ul className="list">
                    {this.hookChildren(children, value, onSelect)}
                </ul>
            </div>
        )

        return <>
            <div
                className={classnames('select', cn)}
                style={style}
                ref={this.$target}
                onClick={this.handleShowDropList}
            >
                {matchChild.props.children}
                <Icon type="triangle-down" />
            </div>
            {hasCreateDropList && createPortal(dropDownList, this.$container)}
        </>
    }
}

interface OptionProps extends BaseComponentProps {
    key: React.Key
    value: OptionValue
    disabled?: boolean
    onClick?: (e: React.MouseEvent<HTMLLIElement>) => void
}

export class Option extends React.Component<OptionProps, {}> {
    render () {
        const { className: cn, style, key, disabled = false, children, onClick = () => {} } = this.props
        const className = classnames('option', { disabled }, cn)

        return (
            <li className={className} style={style} key={key} onClick={onClick}>{children}</li>
        )
    }
}
