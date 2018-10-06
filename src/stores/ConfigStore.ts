import { observable, action, runInAction } from 'mobx'
import * as yaml from 'yaml'
import * as Models from '@models'
import { jsBridge } from '@lib/jsBridge'

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
                .map(p => ({ name: p.name, config: p }))

            const proxyGroups = config['Proxy Group'] as any[] || []
            const proxyGroup: Models.ProxyGroup[] = proxyGroups
                .filter(p => ['url-test', 'select', 'fallback'].includes(p.type))
                .map(p => ({ name: p.name, config: p }))

            this.config = {
                general: {
                    port: config.port || 0,
                    socksPort: config['socks-port'] || 0,
                    redirPort: config['redir-port'] || 0,
                    allowLan: config['allow-lan'] || false,
                    externalControllerAddr: host[0] || '',
                    externalControllerPort: parseInt(host[1], 10) || 0,
                    secret: config.secret || '',
                    logLevel: config['log-level'] || 'info',
                    mode: config.mode || 'Rule'
                },
                proxy,
                proxyGroup,
                rules: config['Rule'] || []
            }
            this.state = 'ok'
        })
    }

}
