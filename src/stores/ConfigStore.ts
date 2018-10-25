import { observable, action, runInAction } from 'mobx'
import * as yaml from 'yaml'
import * as Models from '@models'
import { jsBridge } from '@lib/jsBridge'
import { getConfig } from '@lib/request'
import { getLocalStorageItem } from '@lib/helper'
import { Rule, RuleType } from '@models';

export class ConfigStore {

    @observable
    config: Models.Config = {}

    @observable
    public state: 'pending' | 'ok' | 'error' = 'pending'

    @action
    async fetchAndParseConfig () {
        this.state = 'pending'

        const rawConfig = await jsBridge.readConfigString()

        runInAction(() => {
            // emit error when config is empty
            // because read config might be error
            if (!rawConfig) {
                this.state = 'error'
                return
            }

            // otherwise parse ini
            const config = yaml.parse(rawConfig)

            const externalController = config['external-controller'] as string || ''
            const host = externalController.split(':')

            const proxies = config.Proxy as any[] || []
            const proxy: Models.Proxy[] = proxies
                .filter(p => ['vmess', 'ss', 'socks5'].includes(p.type))

            const proxyGroups = config['Proxy Group'] as any[] || []
            const proxyGroup: Models.ProxyGroup[] = proxyGroups
                .filter(p => ['url-test', 'select', 'fallback'].includes(p.type))
                .map(p => ({ name: p.name, config: p }))
            const rules = config['Rule'] as any[] || []
            const rule: Rule[] = rules.map(r => r.split(',')).filter(r => r.length !== 3).map(r => ({
                type: RuleType[r[0] as string],
                payload: r[1],
                proxy: r[2]
            }))
            this.config = {
                general: {
                    port: config.port || 0,
                    socksPort: config['socks-port'] || 0,
                    redirPort: config['redir-port'] || 0,
                    allowLan: config['allow-lan'] || false,
                    externalControllerAddr: host[0] || '',
                    externalControllerPort: host[1] || '',
                    secret: config.secret || '',
                    logLevel: config['log-level'] || 'info',
                    mode: config.mode || 'Rule'
                },
                proxy,
                proxyGroup,
                rules: rule || []
            }
            this.state = 'ok'
        })
    }

    @action
    async fetchConfig () {
        const { data: config } = await getConfig()
        this.config = {
            general: {
                port: config.port,
                socksPort: config['socket-port'],
                redirPort: config['redir-port'],
                allowLan: config['allow-lan'],
                mode: config.mode,
                externalControllerAddr: getLocalStorageItem('externalControllerAddr', '127.0.0.1'),
                externalControllerPort: getLocalStorageItem('externalControllerPort', '8080'),
                secret: getLocalStorageItem('secret', '')
            }
        }
    }
    @action
    async updateConfig () {
        const { general, proxy, proxyGroup, rules } = this.config
        const externalController = `${general.externalControllerAddr}:${general.externalControllerPort}`
        const proxyGroups = proxyGroup.map(p => ({
            name: p.name,
            ...p.config
        }))
        const config = {
            'external-controller': externalController,
            port: general.port,
            'socks-port': general.socksPort,
            'redir-port': general.redirPort,
            'allow-lan': general.allowLan,
            secret: general.secret,
            'log-level': general.logLevel,
            mode: general.mode,
            Proxy: proxy,
            'Proxy Group': proxyGroups,
            Rule: rules
        }
        const data = yaml.stringify(config)
        console.log(data)
        // jsBridge.writeConfigWithString(data)
    }
}
