import * as React from 'react'
import { format } from 'timeago.js'
import { Card, Tag, Icon, Loading, useLoading } from '@components'
import { containers } from '@stores'
import { Provider as IProvider, Proxy as IProxy, updateProvider, healthCheckProvider } from '@lib/request'
import { Proxy } from '../Proxy'
import './style.scss'

interface ProvidersProps {
    provider: IProvider
}

export function Provider (props: ProvidersProps) {
    const { fetch } = containers.useData()
    const { useTranslation, lang } = containers.useI18n()
    const { provider } = props

    const { t } = useTranslation('Proxies')

    const { visible, hide, show } = useLoading(false)

    function handleHealthChech () {
        show()
        healthCheckProvider(provider.name).then(() => fetch()).finally(() => hide())
    }

    function handleUpdate () {
        show()
        updateProvider(provider.name).then(() => fetch()).finally(() => hide())
    }

    return (
        <Card className="proxy-provider">
            <Loading visible={visible} />
            <div className="proxy-provider-header">
                <div className="proxy-provider-header-part">
                    <span className="proxy-provider-name">{ provider.name }</span>
                    <Tag>{ provider.vehicleType }</Tag>
                </div>
                <div className="proxy-provider-header-part">
                    {
                        provider.updatedAt &&
                        <span className="proxy-provider-update">{ `${t('providerUpdateTime')}: ${format(new Date(provider.updatedAt), lang)}`}</span>
                    }
                    <Icon className="proxy-provider-icon healthcheck" type="healthcheck" size={18} onClick={handleHealthChech} />
                    <Icon className="proxy-provider-icon" type="update" size={18} onClick={handleUpdate} />
                </div>
            </div>
            <ul className="proxies-list">
                {
                    provider.proxies.map((p: IProxy) => (
                        <li key={p.name}>
                            <Proxy className="proxy-provider-item" config={p} />
                        </li>
                    ))
                }
            </ul>
        </Card>
    )
}
