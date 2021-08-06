import { isClashX, setupJsBridge } from '@lib/jsBridge'

import renderApp from './render'
// import * as OfflinePluginRuntime from 'offline-plugin/runtime'

/**
 * Global entry
 * Will check if need setup jsbridge
 */
if (isClashX()) {
    setupJsBridge(() => renderApp())
} else {
    renderApp()
}
