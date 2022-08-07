import { useMemo } from 'react'

import { Card, Tag, Icon, Loading } from '@components'
import { compareDesc } from '@containers/Proxies'
import { Proxy } from '@containers/Proxies/components/Proxy'
import { fromNow } from '@lib/date'
import { useVisible } from '@lib/hook'
import { Provider as IProvider, Proxy as IProxy } from '@lib/request'
import { useClient, useI18n, useProxyProviders } from '@stores'

import './style.scss'

interface ProvidersProps {
    provider: IProvider
}

export function Provider (props: ProvidersProps) {
    const { update } = useProxyProviders()
    const { translation, lang } = useI18n()
    const client = useClient()

    const { provider } = props
    const { t } = translation('Proxies')

    const { visible, hide, show } = useVisible()

    function handleHealthChech () {
        show()
        client.healthCheckProvider(provider.name).then(async () => await update()).finally(() => hide())
    }

    function handleUpdate () {
        show()
        client.updateProvider(provider.name).then(async () => await update()).finally(() => hide())
    }

    const proxies = useMemo(() => {
        return (provider.proxies as IProxy[]).slice().sort((a, b) => -1 * compareDesc(a, b))
    }, [provider.proxies])

    return (
        <Card className="proxy-provider">
            <Loading visible={visible} />
            <div className="md:(flex-row items-center) flex flex-col justify-between">
                <div className="flex items-center">
                    <span className="mr-6">{ provider.name }</span>
                    <Tag>{ provider.vehicleType }</Tag>
                </div>
                <div className="flex items-center pt-3 md:pt-0">
                    {
                        provider.updatedAt &&
                        <span className="text-sm">{ `${t('providerUpdateTime')}: ${fromNow(new Date(provider.updatedAt), lang)}`}</span>
                    }
                    <Icon className="text-red cursor-pointer pl-5" type="healthcheck" size={18} onClick={handleHealthChech} />
                    <Icon className="cursor-pointer pl-5" type="update" size={18} onClick={handleUpdate} />
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
