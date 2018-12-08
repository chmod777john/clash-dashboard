import axios, { AxiosInstance } from 'axios'
import { Partial, getLocalStorageItem } from '@lib/helper'
import { isClashX } from '@lib/jsBridge'
import { rootStores } from '@lib/createStore'
import { StreamReader } from './streamer'

let instance: AxiosInstance
let logsStreamReader = null

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

export async function getConfig () {
    const req = await getInstance()
    return req.get<Config>('configs')
}

export async function updateConfig (config: Partial<Config>) {
    const req = await getInstance()
    return req.patch<void>('configs', config)
}

export async function getRules () {
    const req = await getInstance()
    return req.get<Rules>('rules')
}

export async function updateRules () {
    const req = await getInstance()
    return req.put<void>('rules')
}

export async function getProxies () {
    const req = await getInstance()
    return req.get<Proxies>('proxies')
}

export async function getProxy (name: string) {
    const req = await getInstance()
    return req.get<Proxy>(`proxies/${name}`)
}

export async function getProxyDelay (name: string) {
    const req = await getInstance()
    return req.get<{ delay: number }>(`proxies/${name}/delay`, {
        params: {
            timeout: 20000,
            url: 'http://www.gstatic.com/generate_204'
        }
    })
}

export async function changeProxySelected (name: string, select: string) {
    const req = await getInstance()
    return req.get<void>(`proxies/${name}`, { data: { name: select } })
}

export async function getInstance () {
    if (instance) {
        return instance
    }

    const {
        hostname,
        port,
        secret
    } = await getExternalControllerConfig()

    instance = axios.create({
        baseURL: `http://${hostname}:${port}`,
        headers: secret ? { Authorization: `Bearer ${secret}` } : {}
    })

    return instance
}

export async function getExternalControllerConfig () {
    if (isClashX()) {
        await rootStores.config.fetchAndParseConfig()
        const general = rootStores.config.config.general

        return {
            hostname: general.externalControllerAddr,
            port: general.externalControllerPort,
            secret: general.secret
        }
    }

    const hostname = getLocalStorageItem('externalControllerAddr', '127.0.0.1')
    const port = getLocalStorageItem('externalControllerPort', '8080')
    const secret = getLocalStorageItem('secret', '')

    if (!hostname || !port) {
        throw new Error('can\'t get hostname or port')
    }

    return { hostname, port, secret }
}

export async function getLogsStreamReader () {
    if (logsStreamReader) {
        return logsStreamReader
    }
    const externalController = await getExternalControllerConfig()
    const { data: config } = await getConfig()
    const logUrl = `http://${externalController.hostname}:${externalController.port}/logs?level=${config['log-level']}`
    logsStreamReader = new StreamReader({ url: logUrl, bufferLength: 200 })
    return logsStreamReader
}
