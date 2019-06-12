import { observable, action, runInAction } from 'mobx'
import * as yaml from 'yaml'
import * as Models from '@models'
import { jsBridge, isClashX } from '@lib/jsBridge'
import * as API from '@lib/request'
import { getLocalStorageItem, setLocalStorageItem, partition } from '@lib/helper'

export class ConfigStore {

    @observable
    config: Models.Config = {
        proxy: [],
        proxyGroup: [],
        rules: []
    }

    @observable
    data: Models.Data = {
        general: {},
        proxy: [],
        proxyGroup: [],
        rules: []
    }

    @observable
    apiInfo: Models.APIInfo = {
        hostname: '127.0.0.1',
        port: '9090',
        secret: ''
    }

    @observable
    showAPIModal = false

    @observable
    clashxData: Models.ClashXData = {
        startAtLogin: false,
        systemProxy: false
    }

    @action
    async fetchAPIInfo () {
        if (isClashX()) {
            const apiInfo = await jsBridge.getAPIInfo()
            runInAction(() => {
                this.apiInfo = { hostname: apiInfo.host, port: apiInfo.port, secret: apiInfo.secret }
            })
            return
        }
        const info = await API.getExternalControllerConfig()

        runInAction(() => {
            this.apiInfo = { ...info }
        })
    }

    @action
    async fetchData () {
        const [{ data: general }, rawProxies, rules] = await Promise.all([API.getConfig(), API.getProxies(), API.getRules()])

        runInAction(() => {
            this.data.general = {
                port: general.port,
                socksPort: general['socks-port'],
                redirPort: general['redir-port'],
                mode: general.mode,
                logLevel: general['log-level'],
                allowLan: general['allow-lan']
            }

            const policyGroup = new Set(['Selector', 'URLTest', 'Fallback', 'LoadBalance'])
            const unUsedProxy = new Set(['DIRECT', 'REJECT', 'GLOBAL'])
            const proxyList = rawProxies.data.proxies['GLOBAL'] as API.Group
            const proxies = proxyList.all
                .filter(key => !unUsedProxy.has(key))
                .map(key => ({ ...rawProxies.data.proxies[key], name: key }))
            const [proxy, groups] = partition(proxies, proxy => !policyGroup.has(proxy.type))
            this.data.proxy = proxy as API.Proxy[]
            this.data.proxyGroup = groups as API.Group[]
            this.data.rules = rules.data.rules
        })
    }

    @action
    async fetchClashXData () {
        const startAtLogin = await jsBridge.getStartAtLogin()
        const systemProxy = await jsBridge.isSystemProxySet()

        runInAction(() => {
            this.clashxData = {
                startAtLogin,
                systemProxy
            }
        })
    }

    @action
    async fetchAndParseConfig () {
        const rawConfig = await jsBridge.readConfigString()

        runInAction(() => {
            // emit error when config is empty
            // because read config might be error
            if (!rawConfig) {
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
            const rules = config['Rule'] as any[] || []
            const rule: Models.Rule[] = rules.map(r => r.split(',')).filter(r => r.length >= 3).map(r => ({
                type: Models.RuleType[r[0] as string],
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
        })
    }

    @action
    async fetchConfig () {
        const { data: config } = await API.getConfig()
        this.config = {
            general: {
                port: config.port,
                socksPort: config['socks-port'],
                redirPort: config['redir-port'],
                allowLan: config['allow-lan'],
                mode: config.mode,
                externalControllerAddr: getLocalStorageItem('externalControllerAddr', '127.0.0.1'),
                externalControllerPort: getLocalStorageItem('externalControllerPort', '9090'),
                secret: getLocalStorageItem('secret', '')
            }
        }
    }

    @action
    async updateConfig () {
        const { general, proxy, proxyGroup, rules } = this.config
        const externalController = `${general.externalControllerAddr}:${general.externalControllerPort}`
        const Rule = rules.map(r => [r.type, r.payload, r.proxy].join(','))
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
            'Proxy Group': proxyGroup,
            Rule
        }
        const data = yaml.stringify(config)
        // console.log(data)
        jsBridge.writeConfigWithString(data)
    }

    @action
    async updateAPIInfo (info: Models.APIInfo) {
        const { hostname, port, secret } = info
        setLocalStorageItem('externalControllerAddr', hostname)
        setLocalStorageItem('externalControllerPort', port)
        setLocalStorageItem('secret', secret)
        window.location.reload()
    }

    @action
    setShowAPIModal (visible: boolean) {
        runInAction(() => {
            this.showAPIModal = visible
        })
    }

    @action
    async modifyProxyByIndexAndSave (index: number, config: Models.Proxy) {
        const { proxy } = this.config
        const fomatedConfig: Models.Proxy = {}
        const { type } = config
        let configList: string[] = []

        switch (type) {
        case 'ss':
            configList = Models.SsProxyConfigList
            break
        case 'vmess':
            configList = Models.VmessProxyConfigList
            break
        case 'socks5':
            configList = Models.Socks5ProxyConfigList
            break
        }

        for (const configKey of configList) {
            fomatedConfig[configKey] = config[configKey]
        }

        proxy[index] = fomatedConfig
        await this.updateConfig()
        await this.fetchAndParseConfig()
    }
}
