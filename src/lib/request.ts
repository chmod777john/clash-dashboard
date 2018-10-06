import axios, { AxiosInstance } from 'axios'
import { Partial, getLocalStorageItem } from '@lib/helper'
import { isClashX } from '@lib/jsBridge'
import { rootStores } from '@lib/createStore'

let instance: Request

export interface Config {
    port: number
    'socket-port': number
    'redir-port': number
    'allow-lan': boolean
    mode: string
    'log-level': string
}

export interface Rules {
    rules: { name: string, payload: string }[]
}

export interface Proxies {
    proxies: {
        [key: string]: Proxy
    }
}

export interface Proxy {
    type: 'Direct' | 'Selector' | 'Reject' | 'URLTest' | 'Shadowsocks' | 'Vmess' | 'Socks' | 'Fallback'
    now?: string
    all?: string[]
}

export class Request {
    protected instance: AxiosInstance

    constructor (host: string, secret?: string) {
        this.instance = axios.create({
            baseURL: host,
            headers: secret ? { Authorization: `Bearer ${secret}` } : {}
        })
    }

    getConfig () {
        return this.instance.get<Config>('configs')
    }

    updateConfig (config: Partial<Config>) {
        return this.instance.put<void>('configs', config)
    }

    getRules () {
        return this.instance.get<Rules>('rules')
    }

    updateRules () {
        return this.instance.put<void>('rules')
    }

    getProxies () {
        return this.instance.get<Proxies>('proxies')
    }

    getProxy (name: string) {
        return this.instance.get<Proxy>('proxies/:name', { params: { name } })
    }

    getProxyDelay (name: string) {
        return this.instance.get<{ delay: number }>('proxies/:name/delay', { params: { name } })
    }

    changeProxySelected (name: string, select: string) {
        return this.instance.get<void>('proxies/:name', { params: { name }, data: { name: select } })
    }
}

export async function Instance () {
    if (instance) {
        return instance
    }

    if (isClashX()) {
        await rootStores.config.fetchAndParseConfig()
        const general = rootStores.config.config.general
        instance = new Request(
            `http://${general.externalControllerAddr}:${general.externalControllerPort}`,
            general.secret
        )
        return instance
    }

    const hostname = getLocalStorageItem('externalControllerAddr', '')
    const port = getLocalStorageItem('externalControllerPort', '')
    const secret = getLocalStorageItem('secret', '')
    if (!hostname || !port) {
        throw new Error('can\'t get hostname or port')
    }
    instance = new Request(`http://${hostname}:${port}`, secret)
    return instance
}
