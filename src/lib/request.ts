import axios, { AxiosInstance } from 'axios'
import { Partial, getLocalStorageItem } from '@lib/helper'
import { isClashX, jsBridge } from '@lib/jsBridge'
import { rootStores } from '@lib/createStore'
import { StreamReader } from './streamer'

let instance: AxiosInstance
let logsStreamReader = null

export interface Config {
    port: number
    'socks-port': number
    'redir-port': number
    'allow-lan': boolean
    mode: string
    'log-level': string
}

export interface Rules {
    rules: Rule[]
}

export interface Rule {
    type: string
    payload: string
    proxy: string
}

export interface Proxies {
    proxies: {
        [key: string]: Proxy | Group
    }
}

interface History {
    time: string
    delay: number
}

export interface Proxy {
    name: string
    type: 'Direct' | 'Reject' | 'Shadowsocks' | 'Vmess' | 'Socks' | 'Http'
    history: History[]
}

export interface Group {
    name: string
    type: 'Selector' | 'URLTest' | 'Fallback'
    now: string
    all: string[]
    history: History[]
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
            timeout: 5000,
            url: 'http://www.gstatic.com/generate_204'
        }
    })
}

export async function changeProxySelected (name: string, select: string) {
    const req = await getInstance()
    return req.put<void>(`proxies/${name}`, { name: select })
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
        baseURL: `//${hostname}:${port}`,
        headers: secret ? { Authorization: `Bearer ${secret}` } : {}
    })

    instance.interceptors.response.use(
        resp => resp,
        err => {
            if (!err.response || err.response.status === 401) {
                rootStores.store.setShowAPIModal(true)
            }
            throw err
        }
    )

    return instance
}

export async function getExternalControllerConfig () {
    if (isClashX()) {
        const info = await jsBridge.getAPIInfo()

        return {
            hostname: info.host,
            port: info.port,
            secret: info.secret
        }
    }

    const hostname = getLocalStorageItem('externalControllerAddr', '127.0.0.1')
    const port = getLocalStorageItem('externalControllerPort', '9090')
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
    const logUrl = `//${externalController.hostname}:${externalController.port}/logs?level=${config['log-level']}`
    const auth = externalController.secret ? { Authorization: `Bearer ${externalController.secret}` } : {}
    logsStreamReader = new StreamReader({ url: logUrl, bufferLength: 200, headers: auth })
    return logsStreamReader
}
