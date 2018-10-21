import * as React from 'react'
import produce from 'immer'
import { translate } from 'react-i18next'
import { SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { Header, Icon, Card, Row, Col, Select, Option, Input } from '@components'
import { I18nProps, RuleType } from '@models'
import './style.scss'

interface Rule {
    type: RuleType
    payload: string
    proxy: string
}

interface RulesState {
    rules: Rule[]
    proxies: { [key: string]: { type: string } }
    modifiedIndex: number
}

class Rules extends React.Component<I18nProps, RulesState> {

    state = {
        rules: [
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'google.com.hk', proxy: 'HK' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN-SUFFIX'], payload: 'twitter.com', proxy: 'HKG' },
            { type: RuleType['DOMAIN'], payload: 'pornhub.com', proxy: 'HKG' }
        ],
        proxies: {
            DIRECT: { type: 'Direct' },
            GLOBAL: { type: 'Selector' },
            HKG: { type: 'URLTest' },
            HK: { type: 'Shadowsocks' },
            SGGGGGGGGGG: { type: 'Vmess' },
            REJECT: { type: 'Reject' }
        },
        modifiedIndex: -1
    }

    private handleModifyType = (index, type) => {
        const { rules } = this.state

        this.setState({
            rules: produce(rules, draftState => {
                draftState[index].type = type
            })
        })
    }

    private handleModifyPayload = (index, payload) => {
        const { rules } = this.state

        this.setState({
            rules: produce(rules, draftState => {
                draftState[index].payload = payload
            })
        })
    }

    private handleModifyProxy = (index, proxy) => {
        const { rules } = this.state

        this.setState({
            rules: produce(rules, draftState => {
                draftState[index].proxy = proxy
            })
        })
    }

    private addRule = () => {
        const { rules } = this.state
        const newRule = { type: RuleType['DOMAIN-SUFFIX'], payload: 'google.com.hk', proxy: 'DIRECT' }
        const newRules = produce(rules, draftState => {
            draftState.unshift(newRule)
        })

        this.setState({
            rules: newRules,
            modifiedIndex: 0
        })
    }

    private removeRule = (index) => {
        const { rules } = this.state

        this.setState({
            rules: rules.filter((r, idx) => idx !== index)
        })
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            rules: arrayMove(this.state.rules, oldIndex, newIndex)
        })
    }

    renderRules = ({ rules }) => {
        const SortableItem = SortableElement<{ rule: Rule, idx: number }>(itemProps => {
            const { rule, idx } = itemProps
            return this.renderRuleItem(rule, idx)
        })

        return <ul>
            {
                rules.map((rule: Rule, idx: number) => {
                    const isFinal = rule.type === 'FINAL'
                    return <SortableItem key={idx} index={idx} idx={idx} rule={rule} disabled={isFinal} />
                })
            }
        </ul>
    }

    renderRuleItem = (rule: Rule, index) => {
        const { modifiedIndex, proxies } = this.state
        const isFinal = rule.type === 'FINAL'
        const DragHandle = SortableHandle(() => <Icon type="drag" size={16} />)
        return (
            <li className="rule-item" key={index}>
                <Row className="rule-item-row" gutter={24} align="middle">
                    <Col className="drag-handler" span={1}>
                        {!isFinal && <DragHandle />}
                    </Col>
                    <Col className="rule-type" span={5}>
                        {
                            isFinal
                                ? rule.type
                                : (
                                    <Select key={index} value={rule.type} onSelect={type => this.handleModifyType(index, type)}>
                                        {
                                            Object.keys(RuleType)
                                                .filter(type => type !== 'FINAL')
                                                .map(typeName => {
                                                    const type = RuleType[typeName]
                                                    return (
                                                        <Option value={type} key={type}>{type}</Option>
                                                    )
                                                })
                                        }
                                    </Select>
                                )
                        }
                    </Col>
                    <Col className="payload" span={8}>
                        {
                            modifiedIndex === index
                            ? (
                                <Input
                                    value={rule.payload}
                                    align="left"
                                    inside={true}
                                    autoFocus={true}
                                    onChange={ value => this.handleModifyPayload(index, value) }
                                    onBlur={() => this.setState({ modifiedIndex: -1 })}
                                    style={{ maxWidth: 230 }}
                                />
                            )
                            : <span onClick={() => this.setState({
                                modifiedIndex: index
                            })}>{rule.payload}</span>
                        }
                    </Col>
                    <Col className="rule-proxy" span={5}>
                        <Select className="rule-proxy-option" key={index} value={rule.proxy} onSelect={proxy => this.handleModifyProxy(index, proxy)}>
                            {
                                Object.keys(proxies).map(proxyName => {
                                    const proxy = proxies[proxyName]
                                    return (
                                        <Option className="rule-proxy-option" value={proxyName} key={`${proxyName}-${proxy.type}`}>
                                            <span className="label">{proxy.type}</span>
                                            <span className="value">{proxyName}</span>
                                        </Option>
                                    )
                                })
                            }
                        </Select>
                    </Col>
                    <Col className="delete-btn" span={2} offset={3}>
                        {!isFinal && <span onClick={() => this.removeRule(index)}>删除</span>}
                    </Col>
                </Row>
            </li>
        )
    }

    render () {
        const { t } = this.props
        const { rules } = this.state
        // const SortableList = SortableContainer<{ rules: Rule[] }>(this.renderRules)
        return (
            <div className="page">
                <Header title={t('title')} >
                    <Icon type="plus" size={20} style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={this.addRule}/>
                </Header>

                <Card className="rules-card">
                    <div className="rules">
                        {
                            rules.map((rule: Rule, index) => this.renderRuleItem(rule, index))
                        }
                        {/* <SortableList rules={rules} onSortEnd={this.onSortEnd} useDragHandle={true} /> */}
                    </div>
                </Card>
            </div>
        )
    }
}

export default translate(['Rules'])(Rules)
