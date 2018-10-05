export interface Rule {

    type?: RuleType

    value?: string

    use?: string   // proxy or proxy group name

}

export enum RuleType {
    DOMAIN = 'DOMAIN',
    'DOMAIN-SUFFIX' = 'DOMAIN-SUFFIX',
    'DOMAIN-KEYWORD' = 'DOMAIN-KEYWORD',
    'GEOIP' = 'GEOIP',
    'FINAL' = 'FINAL'
}
