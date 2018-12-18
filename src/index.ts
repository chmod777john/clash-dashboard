import renderApp from './render'
import { isClashX, setupJsBridge } from '@lib/jsBridge'
// import * as OfflinePluginRuntime from 'offline-plugin/runtime'

/**
 * Global entry
 * Will check if need setup jsbridge
 */
if (isClashX()) {
    setupJsBridge(renderApp)
} else {
    renderApp()
}

// PWA install
// OfflinePluginRuntime.install({
//     onUpdateReady: () => {
//         console.log('SW Event:', 'onUpdateReady')
//         // Tells to new SW to take control immediately
//         OfflinePluginRuntime.applyUpdate()
//     },
//     onUpdated: () => {
//         console.log('SW Event:', 'onUpdated')
//         // Reload the webpage to load into the new version
//         window.location.reload()
//     },
//     onUpdateFailed: () => {
//         console.error('SW Event:', 'onUpdateFailed')
//     }
// })
