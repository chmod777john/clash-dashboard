import * as React from 'react'
import { useMemo } from 'react'
import { Card, Tag, Icon, Loading } from '@components'
import { useI18n, useProxyProviders } from '@stores'
import { fromNow } from '@lib/date'
import { Provider as IProvider, Proxy as IProxy, updateProvider, healthCheckProvider } from '@lib/request'
import { useVisible } from '@lib/hook'
import { Proxy } from '../Proxy'
import { compareDesc } from '../../'
import './style.scss'

interface ProvidersProps {
    provider: IProvider
}

export function Provider (props: ProvidersProps) {
    const { update } = useProxyProviders()
    const { translation, lang } = useI18n()

    const { provider } = props
    const { t } = translation('Proxies')

    const { visible, hide, show } = useVisible()

    function handleHealthChech () {
        show()
        healthCheckProvider(provider.name).then(() => update()).finally(() => hide())
    }

    function handleUpdate () {
        show()
        updateProvider(provider.name).then(() => update()).finally(() => hide())
    }

    const proxies = useMemo(() => {
        return (provider.proxies as IProxy[]).slice().sort((a, b) => -1 * compareDesc(a, b))
    }, [provider.proxies])

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
                        <span className="proxy-provider-update">{ `${t('providerUpdateTime')}: ${fromNow(new Date(provider.updatedAt), lang)}`}</span>
                    }
                    <Icon className="proxy-provider-icon healthcheck" type="healthcheck" size={18} onClick={handleHealthChech} />
                    <Icon className="proxy-provider-icon" type="update" size={18} onClick={handleUpdate} />
                </div>
            </div>
            <ul className="proxies-list">
                {
                    proxies.map((p: IProxy) => (
                        <li key={p.name}>
                            <Proxy className="proxy-provider-item" config={p} />
                        </li>
                    ))
                }
            </ul>
        </Card>
    )
}
