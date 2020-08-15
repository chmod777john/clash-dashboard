import React from 'react'
import { Header, Card, Row, Col } from '@components'
import { useI18n, useRule, useRuleProviders } from '@stores'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import useSWR from 'swr'
import { Provider } from './Provider'
import './style.scss'

function RuleProviders () {
    const { providers } = useRuleProviders()
    const { useTranslation } = useI18n()
    const { t } = useTranslation('Rules')

    return <>
        {
            providers.length !== 0 &&
            <div className="proxies-container">
                <Header title={t('providerTitle')} />
                <ul className="proxies-providers-list">
                    {
                        providers.map(p => (
                            <li className="proxies-providers-item" key={p.name}>
                                <Provider provider={p} />
                            </li>
                        ))
                    }
                </ul>
            </div>
        }
    </>
}

export default function Rules () {
    const { rules, update } = useRule()
    const { useTranslation } = useI18n()
    const { t } = useTranslation('Rules')

    useSWR('rules', update)

    function renderRuleItem ({ index, style }: { index: number, style: React.CSSProperties }) {
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
            <RuleProviders />
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
