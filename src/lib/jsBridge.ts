/**
 * For support ClashX runtime
 *
 * Clash Dashboard will use jsbridge to
 * communicate with ClashX
 *
 * Before React app rendered, jsbridge
 * should be checked if initialized,
 * and also should checked if it's
 * ClashX runtime
 *
 * @author jas0ncn
 */

declare global {
    interface Window {
        webkit?: {
            messageHandlers: {
                jsBridge: {
                    postMessage: (data: object) => void
                }
            }
        }
    }
}

/**
 * Check if perched in ClashX Runtime
 */
export function isClashX () {
    return navigator.userAgent === 'ClashX Runtime'
}

/**
 * Closure save jsbridge instance
 */
export let jsBridge: JsBridge | null = null

/**
 * JsBridge class
 */
export class JsBridge {
    constructor (callback: () => void) {
        // init jsbridge
        this.initBridge(() => {
            callback()
        })
    }

    private readonly callbacksMap = new Map<string, (data: unknown) => void>()

    /**
     * setup a jsbridge before app render
     * @param {Function} cb callback when jsbridge initialized
     */
    private initBridge (callback: () => void) {
        /**
         * You need check if inClashX first
         */
        if (!isClashX()) {
            return callback?.()
        }
        window.addEventListener('message', (event) => {
            const data = event.data
            if (data?.id == null) {
                return
            }
            const callback = this.callbacksMap.get(data.id)
            callback?.(data.data)
            this.callbacksMap.delete(data.id)
        })
        callback?.()
    }

    public async callHandler<T, D = unknown> (handleName: string, data?: D) {
        const eventID = Date.now().toString()
        const packageData = { id: eventID, data, name: handleName }
        window.webkit?.messageHandlers.jsBridge.postMessage(packageData)
        return await new Promise<T>((resolve) => {
            this.callbacksMap.set(eventID, (data) => {
                resolve(data as T)
            })
            window.webkit?.messageHandlers.jsBridge.postMessage(packageData)
        })
    }

    public async ping () {
        return await this.callHandler('ping')
    }

    public async readConfigString () {
        return await this.callHandler<string>('readConfigString')
    }

    public async getPasteboard () {
        return await this.callHandler<string>('getPasteboard')
    }

    public async getAPIInfo () {
        return await this.callHandler<{ host: string, port: string, secret: string }>('apiInfo')
    }

    public async setPasteboard (data: string) {
        return await this.callHandler('setPasteboard', data)
    }

    public async writeConfigWithString (data: string) {
        return await this.callHandler('writeConfigWithString', data)
    }

    public async setSystemProxy (data: boolean) {
        return await this.callHandler('setSystemProxy', data)
    }

    public async getStartAtLogin () {
        return await this.callHandler<boolean>('getStartAtLogin')
    }

    public async getProxyDelay (name: string) {
        return await this.callHandler<number>('speedTest', name)
    }

    public async setStartAtLogin (data: boolean) {
        return await this.callHandler<boolean>('setStartAtLogin', data)
    }

    public async isSystemProxySet () {
        return await this.callHandler<boolean>('isSystemProxySet')
    }
}

export function setupJsBridge (callback: () => void) {
    if (jsBridge != null) {
        callback()
        return
    }

    jsBridge = new JsBridge(callback)
}
