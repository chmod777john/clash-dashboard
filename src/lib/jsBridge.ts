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
    registerHandler: (eventName: string, callback?: (data: any, responseCallback: (param: any) => void) => void) => void

    /**
     * Call a native handle
     */
    callHandler: (handleName: string, data?: any, responseCallback?: (responseData: any) => void) => void

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
        WVJBCallbacks?: Function[]

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
export let jsBridge: JsBridge = null

/**
 * JsBridge class
 */
export class JsBridge {

    instance: JsBridgeAPI = null

    constructor (callback = jsbridge => {}) {
        if (window.WebViewJavascriptBridge) {
            this.instance = window.WebViewJavascriptBridge
            callback(this.instance)
        }

        // init jsbridge
        this.initBridge(jsBridge => {
            this.instance = jsBridge
            callback(jsBridge)
        })
    }

    /**
     * setup a jsbridge before app render
     * @param {Function} cb callback when jsbridge initialized
     * @see https://github.com/marcuswestin/WebViewJavascriptBridge
     */
    private initBridge (callback) {
        /**
         * You need check if inClashX first
         */
        if (!isClashX()) {
            return callback(null)
        }

        if (window.WebViewJavascriptBridge) {
            return callback(window.WebViewJavascriptBridge)
        }

        // setup callback
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback)
        }

        window.WVJBCallbacks = [callback]

        const WVJBIframe = document.createElement('iframe')
        WVJBIframe.style.display = 'none'
        WVJBIframe.src = 'https://__bridge_loaded__'
        document.documentElement.appendChild(WVJBIframe)
        setTimeout(() => document.documentElement.removeChild(WVJBIframe), 0)
    }

    public callHandler (handleName: string, data?: any) {
        return new Promise(resolve => {
            this.instance.callHandler(
                handleName,
                data || undefined,
                resolve
            )
        })
    }
}

export function setupJsBridge (callback) {
    if (jsBridge) {
        return callback(jsBridge)
    }

    jsBridge = new JsBridge(callback)
}
