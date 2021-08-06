import classnames from 'classnames'
import * as React from 'react'

import { Tag, Icon } from '@components'
import { fromNow } from '@lib/date'
import { useVisible } from '@lib/hook'
import { RuleProvider } from '@lib/request'
import { useClient, useI18n, useRuleProviders } from '@stores'
import './style.scss'

interface ProvidersProps {
    provider: RuleProvider
}

export function Provider (props: ProvidersProps) {
    const { update } = useRuleProviders()
    const { translation, lang } = useI18n()
    const client = useClient()

    const { provider } = props
    const { t } = translation('Rules')

    const { visible, hide, show } = useVisible()

    function handleUpdate () {
        show()
        client.updateRuleProvider(provider.name).then(async () => await update()).finally(() => hide())
    }

    const updateClassnames = classnames('rule-provider-icon', { 'rule-provider-loading': visible })

    return (
        <div className="rule-provider">
            <div className="rule-provider-header">
                <div className="rule-provider-header-part">
                    <span className="rule-provider-name">{ provider.name }</span>
                    <Tag>{ provider.vehicleType }</Tag>
                    <Tag className="rule-provider-behavior">{ provider.behavior }</Tag>
                    <span className="rule-provider-update">{ `${t('ruleCount')}: ${provider.ruleCount}` }</span>
                </div>
                <div className="rule-provider-header-part">
                    {
                        provider.updatedAt &&
                        <span className="rule-provider-update">{ `${t('providerUpdateTime')}: ${fromNow(new Date(provider.updatedAt), lang)}`}</span>
                    }
                    <Icon className={updateClassnames} type="update" size={18} onClick={handleUpdate} />
                </div>
            </div>
        </div>
    )
}
