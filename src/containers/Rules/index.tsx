import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Header, Card, Row, Col } from '@components'
import { BaseRouterProps } from '@models'
import './style.scss'
import { storeKeys } from '@lib/createStore'
import { inject, observer } from 'mobx-react'
import { List, AutoSizer } from 'react-virtualized'

interface RulesProps extends BaseRouterProps, WithTranslation {}

@inject(...storeKeys)
@observer
class Rules extends React.Component<RulesProps, {}> {

    componentWillMount () {
        this.props.store.fetchData()
    }

    renderRuleItem = ({ index, key, style }) => {
        const { rules } = this.props.store.data
        const rule = rules[index]
        return (
            <li className="rule-item" key={key} style={style}>
                <Row className="rule-item-row" gutter={24} align="middle">
                    <Col className="rule-type" span={6} offset={1}>
                        { rule.type }
                    </Col>
                    <Col className="payload" span={11}>
                        { rule.payload }
                    </Col>
                    <Col className="rule-proxy" span={6}>
                        { rule.proxy }
                    </Col>
                </Row>
            </li>
        )
    }

    render () {
        const { t } = this.props
        const { rules } = this.props.store.data
        return (
            <div className="page">
                <Header title={t('title')} />
                <Card className="rules-card">
                    <AutoSizer className="rules">
                        {
                            ({ height, width }) => (
                                <List
                                    height={height}
                                    width={width}
                                    rowCount={rules.length}
                                    rowRenderer={this.renderRuleItem}
                                    rowHeight={50}
                                    overscanRowCount={10}
                                />
                            )
                        }
                    </AutoSizer>
                </Card>
            </div>
        )
    }
}

export default withTranslation(['Rules'])(Rules)
