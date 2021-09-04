import { isClashX, setupJsBridge } from '@lib/jsBridge'

import renderApp from './render'

/**
 * Global entry
 * Will check if need setup jsbridge
 */
if (isClashX()) {
    setupJsBridge(() => renderApp())
} else {
    renderApp()
}
