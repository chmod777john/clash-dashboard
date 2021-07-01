/**
 * proxy config interface
 */

export const ProxyType = {
    Shadowsocks: 'ss',
    Vmess: 'vmess',
    Socks5: 'socks5',
}

export type Proxy = ShadowsocksProxy & VmessProxy & Socks5Proxy

export const SsProxyConfigList = [
    'name', 'type', 'server', 'port', 'cipher', 'password', 'obfs', 'obfs-host',
]
export interface ShadowsocksProxy {
    name?: string

    type?: 'ss'

    server?: string

    port?: number

    cipher?: string

    password?: string

    obfs?: string

    'obfs-host'?: string
}

export const VmessProxyConfigList = [
    'name', 'type', 'server', 'port', 'uuid', 'alterid', 'cipher', 'tls',
]
export interface VmessProxy {
    name?: string

    type?: 'vmess'

    server?: string

    port?: number

    uuid?: string

    alterId?: number

    cipher?: string

    tls?: boolean
}

export const Socks5ProxyConfigList = ['name', 'type', 'server', 'port']
export interface Socks5Proxy {
    name?: string

    type?: 'socks5'

    server?: string

    port?: number
}

export type ProxyGroup = SelectProxyGroup & UrlTestProxyGroup & FallbackProxyGroup & LoadBalanceGroup

export interface SelectProxyGroup {
    name?: string

    type?: 'select'

    proxies?: string[] // proxy names
}

export interface LoadBalanceGroup {
    name?: string

    type?: 'load-balance'

    proxies?: string[] // proxy names
}

export interface FallbackProxyGroup {
    name?: string

    type?: 'fallback'

    proxies?: string[] // proxy names

    url?: string

    interval?: number // second
}

export interface UrlTestProxyGroup {
    name?: string

    type?: 'url-test'

    proxies?: string[] // proxy names

    url?: string

    interval?: number // second
}
