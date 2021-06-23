import { ResultAsync } from 'neverthrow'
import { AxiosError } from 'axios'
import { atom, useAtom } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { useCallback, useEffect } from 'react'
import { get } from 'lodash-es'
import useSWR from 'swr'

import { getLanguage, Language, setLanguage, locales, Lang } from '@i18n'
import { useWarpImmerSetter } from '@lib/jotai'
import * as API from '@lib/request'
import * as Models from '@models'
import { partition, setLocalStorageItem } from '@lib/helper'
import { isClashX, jsBridge } from '@lib/jsBridge'

const identity = atom(true)

type AsyncFunction<A, O> = (...args: A[]) => Promise<O>

export function useIdentity () {
    const [id, set] = useAtom(identity)

    function wrapFetcher<A, O> (fn: AsyncFunction<A, O>) {
        return async function (...args: A[]) {
            const result = await ResultAsync.fromPromise(fn(...args), e => e as AxiosError)
            if (result.isErr()) {
                if (result.error.response?.status === 401) {
                    set(false)
                }
                throw result.error
            }

            set(true)
            return result.value
        }
    }

    return { identity: id, wrapFetcher, set }
}

const language = atom(getLanguage())

export function useI18n () {
    const [lang, set] = useAtom(language)

    function setLang (lang: Lang) {
        set(lang)
        setLanguage(lang)
    }

    const translation = useCallback(
        function (namespace: keyof typeof Language['en_US']) {
            function t (path: string) {
                return get(Language[lang][namespace], path) as string
            }
            return { t }
        },
        [lang]
    )

    return { lang, locales, setLang, translation }
}

export const version = atom({
    version: '',
    premium: false
})

export function useVersion () {
    const [data, set] = useAtom(version)
    const { set: setIdentity } = useIdentity()

    async function update () {
        const result = await ResultAsync.fromPromise(API.getVersion(), e => e as AxiosError)
        setIdentity(result.isOk())

        set(
            result.isErr()
                ? { version: '', premium: false }
                : { version: result.value.data.version, premium: !!result.value.data.premium }
        )
    }

    return { version: data.version, premium: data.premium, update }
}

export function useRuleProviders () {
    const [{ premium }] = useAtom(version)

    const { data, mutate } = useSWR('/providers/rule', async () => {
        if (!premium) {
            return []
        }

        const ruleProviders = await API.getRuleProviders()

        return Object.keys(ruleProviders.data.providers)
            .map<API.RuleProvider>(name => ruleProviders.data.providers[name])
    })

    return { providers: data ?? [], update: mutate }
}

export const config = atomWithImmer({
    breakConnections: false
})

export function useConfig () {
    const [data, set] = useAtom(config)

    return { data, set: useWarpImmerSetter(set) }
}

export const proxyProvider = atom([] as API.Provider[])

export function useProxyProviders () {
    const [providers, set] = useAtom(proxyProvider)

    const { data, mutate } = useSWR('/providers/proxy', async () => {
        const proxyProviders = await API.getProxyProviders()

        return Object.keys(proxyProviders.data.providers)
            .map<API.Provider>(name => proxyProviders.data.providers[name])
            .filter(pd => pd.name !== 'default')
            .filter(pd => pd.vehicleType !== 'Compatible')
    })

    useEffect(() => set(data ?? []), [data, set])
    return { providers, update: mutate }
}

export function useGeneral () {
    const { data, mutate } = useSWR('/config', async () => {
        const resp = await API.getConfig()
        const data = resp.data
        return {
            port: data.port,
            socksPort: data['socks-port'],
            mixedPort: data['mixed-port'] ?? 0,
            redirPort: data['redir-port'],
            mode: data.mode.toLowerCase() as Models.Data['general']['mode'],
            logLevel: data['log-level'],
            allowLan: data['allow-lan']
        } as Models.Data['general']
    })

    return { general: data ?? {} as Models.Data['general'], update: mutate }
}

export const proxies = atomWithImmer({
    proxies: [] as API.Proxy[],
    groups: [] as API.Group[],
    global: {
        name: 'GLOBAL',
        type: 'Selector',
        now: '',
        history: [],
        all: []
    } as API.Group
})

export function useProxy () {
    const [allProxy, rawSet] = useAtom(proxies)
    const set = useWarpImmerSetter(rawSet)

    const { mutate } = useSWR('/proxies', async () => {
        const allProxies = await API.getProxies()

        const global = allProxies.data.proxies.GLOBAL as API.Group
        // fix missing name
        global.name = 'GLOBAL'

        const policyGroup = new Set(['Selector', 'URLTest', 'Fallback', 'LoadBalance'])
        const unUsedProxy = new Set(['DIRECT', 'REJECT', 'GLOBAL'])
        const proxies = global.all
            .filter(key => !unUsedProxy.has(key))
            .map(key => ({ ...allProxies.data.proxies[key], name: key }))
        const [proxy, groups] = partition(proxies, proxy => !policyGroup.has(proxy.type))
        set({ proxies: proxy as API.Proxy[], groups: groups as API.Group[], global: global })
    })

    const markProxySelected = useCallback((name: string, selected: string) => {
        set(draft => {
            if (name === 'GLOBAL') {
                draft.global.now = selected
            }
            for (const group of draft.groups) {
                if (group.name === name) {
                    group.now = selected
                }
            }
        })
    }, [set])

    return {
        proxies: allProxy.proxies,
        groups: allProxy.groups,
        global: allProxy.global,
        update: mutate,
        markProxySelected,
        set
    }
}

export const proxyMapping = atom((get) => {
    const ps = get(proxies)
    const providers = get(proxyProvider)
    const proxyMap = new Map<string, API.Proxy>()
    for (const p of ps.proxies) {
        proxyMap.set(p.name, p as API.Proxy)
    }

    for (const provider of providers) {
        for (const p of provider.proxies) {
            proxyMap.set(p.name, p as API.Proxy)
        }
    }

    return proxyMap
})

export function useClashXData () {
    const { data, mutate } = useSWR('/clashx', async () => {
        if (!isClashX()) {
            return {
                isClashX: false,
                startAtLogin: false,
                systemProxy: false
            }
        }

        const startAtLogin = await jsBridge?.getStartAtLogin() ?? false
        const systemProxy = await jsBridge?.isSystemProxySet() ?? false

        return { startAtLogin, systemProxy, isClashX: true }
    })

    return { data, update: mutate }
}

export const apiData = atom({
    hostname: '127.0.0.1',
    port: '9090',
    secret: ''
})

export function useAPIInfo () {
    const [data, set] = useAtom(apiData)

    const fetch = useCallback(async function fetch () {
        const info = await API.getExternalControllerConfig()
        set({ ...info })
    }, [set])

    async function update (info: typeof data) {
        const { hostname, port, secret } = info
        setLocalStorageItem('externalControllerAddr', hostname)
        setLocalStorageItem('externalControllerPort', port)
        setLocalStorageItem('secret', secret)
        window.location.reload()
    }

    return { data, fetch, update }
}

export const rules = atomWithImmer([] as API.Rule[])

export function useRule () {
    const [data, rawSet] = useAtom(rules)
    const set = useWarpImmerSetter(rawSet)

    async function update () {
        const resp = await API.getRules()
        set(resp.data.rules)
    }

    return { rules: data, update }
}

