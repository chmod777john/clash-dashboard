export interface Rule {

    type?: 'DOMAIN' | 'DOMAIN-SUFFIX' | 'DOMAIN-KEYWORD' | 'DOMAIN-SUFFIX' | 'GEOIP' | 'FINAL'

    value?: string

    use?: string   // proxy or proxy group name

}
