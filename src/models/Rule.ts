import { Proxy } from './Proxy'

export interface Rule {

    type?: 'DOMAIN' | 'DOMAIN-SUFFIX' | 'DOMAIN-KEYWORD' | 'DOMAIN-SUFFIX' | 'GEOIP' | 'FINAL'

    value?: string

    use?: Proxy

}
