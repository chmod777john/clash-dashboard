import axios, { AxiosInstance } from 'axios'

export interface Config {
    port: number
    'socks-port': number
    'redir-port': number
    'mixed-port': number
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
    proxies: Record<string, Proxy | Group>
}

export interface Provider {
    name: string
    proxies: Array<Group | Proxy>
    type: 'Proxy'
    vehicleType: 'HTTP' | 'File' | 'Compatible'
    updatedAt?: string
}

export interface RuleProvider {
    name: string
    type: 'Rule'
    vehicleType: 'HTTP' | 'File'
    behavior: string
    ruleCount: number
    updatedAt?: string
}

export interface RuleProviders {
    providers: Record<string, RuleProvider>
}

export interface ProxyProviders {
    providers: Record<string, Provider>
}

interface History {
    time: string
    delay: number
}

export interface Proxy {
    name: string
    type: 'Direct' | 'Reject' | 'Shadowsocks' | 'Vmess' | 'Socks' | 'Http' | 'Snell'
    history: History[]
}

export interface Group {
    name: string
    type: 'Selector' | 'URLTest' | 'Fallback'
    now: string
    all: string[]
    history: History[]
}

export interface Snapshot {
    uploadTotal: number
    downloadTotal: number
    connections: Connections[]
}

export interface Connections {
    id: string
    metadata: {
        network: string
        type: string
        host: string
        sourceIP: string
        sourcePort: string
        destinationPort: string
        destinationIP?: string
    }
    upload: number
    download: number
    start: string
    chains: string[]
    rule: string
    rulePayload: string
}

export class Client {
    private axiosClient: AxiosInstance
    constructor(url: string, secret?: string) {
        this.axiosClient = axios.create({
            baseURL: url,
            headers: secret ? { Authorization: `Bearer ${secret}` } : {}
        })
    }

    getConfig() {
        return this.axiosClient.get<Config>('configs')
    }

    updateConfig(config: Partial<Config>) {
        return this.axiosClient.patch<void>('configs', config)
    }

    getRules() {
        return this.axiosClient.get<Rules>('rules')
    }

    async getProxyProviders () {
        const resp = await this.axiosClient.get<ProxyProviders>('providers/proxies', {
            validateStatus(status) {
                // compatible old version
                return (status >= 200 && status < 300) || status === 404
            }
        })
        if (resp.status === 404) {
            resp.data = { providers: {} }
        }
        return resp
    }

    getRuleProviders () {
        return this.axiosClient.get<RuleProviders>('providers/rules')
    }

    updateProvider (name: string) {
        return this.axiosClient.put<void>(`providers/proxies/${encodeURIComponent(name)}`)
    }

    updateRuleProvider (name: string) {
        return this.axiosClient.put<void>(`providers/rules/${encodeURIComponent(name)}`)
    }

    healthCheckProvider (name: string) {
        return this.axiosClient.get<void>(`providers/proxies/${encodeURIComponent(name)}/healthcheck`)
    }

    getProxies () {
        return this.axiosClient.get<Proxies>('proxies')
    }

    getProxy (name: string) {
        return this.axiosClient.get<Proxy>(`proxies/${encodeURIComponent(name)}`)
    }

    getVersion () {
        return this.axiosClient.get<{ version: string, premium?: boolean }>('version')
    }

    getProxyDelay (name: string) {
        return this.axiosClient.get<{ delay: number }>(`proxies/${encodeURIComponent(name)}/delay`, {
            params: {
                timeout: 5000,
                url: 'http://www.gstatic.com/generate_204'
            }
        })
    }

    closeAllConnections () {
        return this.axiosClient.delete('connections')
    }

    closeConnection (id: string) {
        return this.axiosClient.delete(`connections/${id}`)
    }

    getConnections () {
        return this.axiosClient.get<Snapshot>('connections')
    }

    changeProxySelected (name: string, select: string) {
        return this.axiosClient.put<void>(`proxies/${encodeURIComponent(name)}`, { name: select })
    }
}
