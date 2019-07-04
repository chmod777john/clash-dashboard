import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Card, Row, Col } from '@components'
import { containers } from '@stores'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import './style.scss'

export default function Rules () {
    const { data, fetch } = containers.useData()
    const { t } = useTranslation(['Rules'])
    const { rules } = data

    useEffect(() => {
        fetch()
    }, [])

    function renderRuleItem ({ index, style }) {
        const rule = rules[index]
        return (
            <li className="rule-item" style={style}>
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
                                itemCount={rules.length}
                                itemSize={50}
                            >
                                { renderRuleItem }
                            </List>
                        )
                    }
                </AutoSizer>
            </Card>
        </div>
    )
}
