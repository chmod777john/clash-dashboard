import * as React from 'react'
import classnames from 'classnames'
import { Card, Tag, Icon } from '@components'
import { useI18n, useRuleProviders } from '@stores'
import { fromNow } from '@lib/date'
import { RuleProvider, updateRuleProvider } from '@lib/request'
import { useVisible } from '@lib/hook'
import './style.scss'

interface ProvidersProps {
    provider: RuleProvider
}

export function Provider (props: ProvidersProps) {
    const { update } = useRuleProviders()
    const { useTranslation, lang } = useI18n()

    const { provider } = props
    const { t } = useTranslation('Proxies')

    const { visible, hide, show } = useVisible()

    function handleUpdate () {
        show()
        updateRuleProvider(provider.name).then(() => update()).finally(() => hide())
    }

    const updateClassnames = classnames('rule-provider-icon', { 'rule-provider-loading': visible })

    return (
        <Card className="rule-provider">
            <div className="rule-provider-header">
                <div className="rule-provider-header-part">
                    <span className="rule-provider-name">{ provider.name }</span>
                    <Tag>{ provider.vehicleType }</Tag>
                    <Tag className="rule-provider-behavior">{ provider.behavior }</Tag>
                </div>
                <div className="rule-provider-header-part">
                    {
                        provider.updatedAt &&
                        <span className="rule-provider-update">{ `${t('providerUpdateTime')}: ${fromNow(new Date(provider.updatedAt), lang)}`}</span>
                    }
                    <Icon className={updateClassnames} type="update" size={18} onClick={handleUpdate} />
                </div>
            </div>
        </Card>
    )
}
