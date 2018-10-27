export interface Rule {

    type?: RuleType

    payload?: string

    proxy?: string   // proxy or proxy group name

}

export enum RuleType {
    'DOMAIN' = 'DOMAIN',
    'DOMAIN-SUFFIX' = 'DOMAIN-SUFFIX',
    'DOMAIN-KEYWORD' = 'DOMAIN-KEYWORD',
    'GEOIP' = 'GEOIP',
    'FINAL' = 'FINAL',
    'IP-CIDR' = 'IP-CIDR',
    'USER-AGENT' = 'USER-AGENT'
}
