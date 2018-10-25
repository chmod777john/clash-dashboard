/**
 * proxy config interface
 */

export enum ProxyType {
    Shadowsocks = 'Shadowsocks',
    Vmess = 'Vmess',
    Socks5 = 'Socks5'
}

export type Proxy = ShadowsocksProxy | VmessProxy | Socks5Proxy

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

export interface VmessProxy {
    name?: string

    type?: 'vmess'

    server?: string

    port?: number

    uuid?: string

    alterid?: number

    cipher?: string

    tls?: boolean

}

export interface Socks5Proxy {
    name?: string

    type?: 'socks5'

    server?: string

    port?: number

}

export interface ProxyGroup {

    /**
     * proxy group name
     */
    name?: string

    /**
     * configs of proxy server
     * now support select and url-test
     */
    config?: SelectProxyGroup | UrlTestProxyGroup | FallbackProxyGroup

}

export interface SelectProxyGroup {

    type?: 'select'

    proxies?: string[] // proxy names

}

export interface FallbackProxyGroup {

    type?: 'fallback'

    proxies?: string[] // proxy names

    url?: string

    interval?: number  // second

}

export interface UrlTestProxyGroup {

    type?: 'url-test'

    proxies?: string[] // proxy names

    url?: string

    interval?: number  // second

}
