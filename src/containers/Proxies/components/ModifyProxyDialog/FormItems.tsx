import * as React from 'react'
import classnames from 'classnames'
import { Row, Col, Input, Icon, Select, Option, Switch } from '@components'
import { noop } from '@lib/helper'

// type selector
export function ProxyTypeSelector ({ types, label, value, onSelect = noop }: {
    types: { [key: string]: string },
    label: string,
    value: string,
    onSelect?: (type: string) => void
}) {
    return (
        <Row gutter={24} className="proxy-editor-row">
            <Col span={6} className="proxy-editor-label">{label}</Col>
            <Col span={18}>
                <Select value={value} onSelect={onSelect}>
                    {
                        Object.keys(types)
                            .map(typeName => {
                                const type = types[typeName]
                                return (
                                    <Option value={type} key={type}>{typeName}</Option>
                                )
                            })
                    }
                </Select>
            </Col>
        </Row>
    )
}

// color selector
export function ProxyColorSelector ({ colors, value, onSelect = noop }: {
    colors: string[],
    value: string,
    onSelect?: (color: string) => void
}) {
    return (
        <Row gutter={24} style={{ padding: '12px 0' }}>
            <div className="proxy-editor-color-selector">
                {
                    colors.map(color => (
                        <span
                            className={classnames('color-item', {
                                'color-item-active': value === color
                            })}
                            key={color}
                            style={{ background: color }}
                            onClick={() => onSelect(color)}
                        />
                    ))
                }
            </div>
        </Row>
    )
}

// input form
export function ProxyInputForm ({ label, value, onChange = noop }: {
    label: string,
    value: string,
    onChange?: (value: string) => void
}) {
    return (
        <Row gutter={24} className="proxy-editor-row">
            <Col span={6} className="proxy-editor-label">{label}</Col>
            <Col span={18}>
                <Input value={value} onChange={onChange} align="left"/>
            </Col>
        </Row>
    )
}

// switch form
export function ProxySwitch ({ label, value, onChange = noop }: {
    label: string,
    value: boolean,
    onChange?: (value: boolean) => void
}) {
    return (
        <Row gutter={24} align="middle" className="proxy-editor-row">
            <Col span={6} className="proxy-editor-label">{label}</Col>
            <Col span={18}>
                <Switch checked={value} onChange={onChange} />
            </Col>
        </Row>
    )
}

// password form
export class ProxyPasswordForm extends React.Component<{
    label: string,
    value: string,
    onChange?: (value: string) => void
}, { showPassword: boolean }> {

    state = {
        showPassword: false
    }

    render () {
        const { label, value, onChange } = this.props
        const { showPassword } = this.state
        const type = showPassword ? 'text' : 'password'
        return (
            <Row gutter={24} className="proxy-editor-row">
                <Col span={6} className="proxy-editor-label">{label}</Col>
                <Col span={18} className="proxy-editor-value">
                    <Input style={{ paddingRight: '32px' }} type={type} value={value} onChange={onChange} align="left" />
                    <Icon
                        className="proxy-editor-passsword-icon"
                        type={showPassword ? 'hide' : 'show'}
                        size={20}
                        onClick={() => this.setState({ showPassword: !showPassword })}
                    />
                </Col>
            </Row>
        )
    }
}

// cipher selector
export function ProxyCipherSelector ({ ciphers, label, value, onSelect = noop }: {
    ciphers: string[],
    label: string,
    value: string,
    onSelect?: (type: string) => void
}) {
    return (
        <Row gutter={24} className="proxy-editor-row">
            <Col span={6} className="proxy-editor-label">{label}</Col>
            <Col span={18}>
                <Select value={value} onSelect={onSelect}>
                    {
                        ciphers.map(cipher => (
                            <Option value={cipher} key={cipher}>{cipher}</Option>
                        ))
                    }
                </Select>
            </Col>
        </Row>
    )
}
