import { useState } from 'react'
import * as Models from '@models'
import { createContainer } from 'unstated-next'
import * as API from '@lib/request'
import { useObject } from '@lib/hook'
import { jsBridge, isClashX } from '@lib/jsBridge'
import { setLocalStorageItem, partition, to } from '@lib/helper'

function useData () {
    const { value: data, change } = useObject<Models.Data>({
        general: {},
        proxy: [],
        proxyGroup: [],
        rules: []
    })

    const [visible, setVisible] = useState(false)

    function show () {
        setVisible(true)
    }

    function hidden () {
        setVisible(false)
    }

    async function fetch () {
        const [resp, err] = await to(Promise.all([API.getConfig(), API.getProxies(), API.getRules()]))
        if (err && (!err.response || err.response.status === 401)) {
            show()
        }

        const [{ data: general }, rawProxies, rules] = resp

        change('general', {
            port: general.port,
            socksPort: general['socks-port'],
            redirPort: general['redir-port'],
            mode: general.mode,
            logLevel: general['log-level'],
            allowLan: general['allow-lan']
        })

        const policyGroup = new Set(['Selector', 'URLTest', 'Fallback', 'LoadBalance'])
        const unUsedProxy = new Set(['DIRECT', 'REJECT', 'GLOBAL'])
        const proxyList = rawProxies.data.proxies['GLOBAL'] as API.Group
        const proxies = proxyList.all
            .filter(key => !unUsedProxy.has(key))
            .map(key => ({ ...rawProxies.data.proxies[key], name: key }))
        const [proxy, groups] = partition(proxies, proxy => !policyGroup.has(proxy.type))

        change('proxy', proxy as API.Proxy[])
        change('proxyGroup', groups as API.Group[])
        change('rules', rules.data.rules)
    }

    return { data, fetch, unauthorized: { visible, show, hidden } }
}

function useAPIInfo () {
    const { value: data, set } = useObject<Models.APIInfo>({
        hostname: '127.0.0.1',
        port: '9090',
        secret: ''
    })

    async function fetch () {
        if (isClashX()) {
            const apiInfo = await jsBridge.getAPIInfo()
            set({ hostname: apiInfo.host, port: apiInfo.port, secret: apiInfo.secret })
            return
        }
        const info = await API.getExternalControllerConfig()
        set({ ...info })
    }

    async function update (info: Models.APIInfo) {
        const { hostname, port, secret } = info
        setLocalStorageItem('externalControllerAddr', hostname)
        setLocalStorageItem('externalControllerPort', port)
        setLocalStorageItem('secret', secret)
        window.location.reload()
    }

    return { data, fetch, update }
}

function useClashXData () {
    const { value: data, set } = useObject<Models.ClashXData>({
        startAtLogin: false,
        systemProxy: false
    })

    async function fetch () {
        const startAtLogin = await jsBridge.getStartAtLogin()
        const systemProxy = await jsBridge.isSystemProxySet()

        set({ startAtLogin, systemProxy })
    }

    return { data, fetch }
}

export const Data = createContainer(useData)
export const APIInfo = createContainer(useAPIInfo)
export const ClashXData = createContainer(useClashXData)
