import { Proxy, ProxyGroup } from './Proxy'
import { Rule } from './Rule'

/**
 * clash config
 * @see https://github.com/Dreamacro/clash#config
 */
export interface Config {

    general?: {

        /**
         * http proxy port
         */
        port?: number

        /**
         * socks proxy port
         */
        socksPort?: number

        /**
         * controller port
         */
        externalController: number

    }

    proxy?: Proxy[]

    proxyGroup?: ProxyGroup[]

    rules?: Rule[]

}
