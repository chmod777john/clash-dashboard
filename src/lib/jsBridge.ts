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

/**
 * declare javascript bridge API
 */
export interface JsBridgeAPI {

    /**
     * Register a javascript bridge event handle
     */
    registerHandler: <D, P>(eventName: string, callback?: (data: D, responseCallback: (param: P) => void) => void) => void

    /**
     * Call a native handle
     */
    callHandler: <T, D>(handleName: string, data?: D, responseCallback?: (responseData: T) => void) => void

    /**
     * Who knows
     */
    disableJavscriptAlertBoxSafetyTimeout: () => void

}

declare global {

    interface Window {

        /**
         * Global jsbridge instance
         */
        WebViewJavascriptBridge?: JsBridgeAPI | null

        /**
         * Global jsbridge init callback
         */
        WVJBCallbacks?: JsBridgeCallback[]

    }

}

type JsBridgeCallback = (jsbridge: JsBridgeAPI | null) => void

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
    instance: JsBridgeAPI | null = null

    constructor (callback: () => void) {
        if (window.WebViewJavascriptBridge != null) {
            this.instance = window.WebViewJavascriptBridge
        }

        // init jsbridge
        this.initBridge(jsBridge => {
            this.instance = jsBridge
            callback()
        })
    }

    /**
     * setup a jsbridge before app render
     * @param {Function} cb callback when jsbridge initialized
     * @see https://github.com/marcuswestin/WebViewJavascriptBridge
     */
    private initBridge (callback: JsBridgeCallback) {
        /**
         * You need check if inClashX first
         */
        if (!isClashX()) {
            return callback?.(null)
        }

        if (window.WebViewJavascriptBridge != null) {
            return callback(window.WebViewJavascriptBridge)
        }

        // setup callback
        if (window.WVJBCallbacks != null) {
            return window.WVJBCallbacks.push(callback)
        }

        window.WVJBCallbacks = [callback]

        const WVJBIframe = document.createElement('iframe')
        WVJBIframe.style.display = 'none'
        WVJBIframe.src = 'https://__bridge_loaded__'
        document.documentElement.appendChild(WVJBIframe)
        setTimeout(() => document.documentElement.removeChild(WVJBIframe), 0)
    }

    public async callHandler<T, D = unknown> (handleName: string, data?: D) {
        return await new Promise<T>((resolve) => {
            this.instance?.callHandler(
                handleName,
                data,
                resolve,
            )
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
