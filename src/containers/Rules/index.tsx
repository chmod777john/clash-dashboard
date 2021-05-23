import React from 'react'
import { Header, Card } from '@components'
import { useI18n, useRule, useRuleProviders } from '@stores'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import useSWR from 'swr'
import { Provider } from './Provider'
import './style.scss'

function RuleProviders () {
    const { providers } = useRuleProviders()
    const { translation } = useI18n()
    const { t } = translation('Rules')

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
    const { translation } = useI18n()
    const { t } = translation('Rules')

    useSWR('rules', update)

    function renderRuleItem ({ index, style }: { index: number, style: React.CSSProperties }) {
        const rule = rules[index]
        return (
            <li className="rule-item" style={style}>
                <div className="py-1 flex">
                    <div className="rule-type w-40 text-center">{ rule.type }</div>
                    <div className="payload flex-1 text-center">{ rule.payload }</div>
                    <div className="rule-proxy w-40 text-center">{ rule.proxy }</div>
                </div>
            </li>
        )
    }

    return (
        <div className="page">
            <RuleProviders />
            <Header title={t('title')} />
            <Card className="flex flex-col flex-1 mt-3 p-0 focus:outline-none">
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
