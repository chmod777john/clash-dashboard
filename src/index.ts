import renderApp from './render'
import { isClashX, setupJsBridge } from './lib/jsBridge'

/**
 * Global entry
 * Will check if need setup jsbridge
 */
if (isClashX()) {
    setupJsBridge(renderApp)
} else {
    renderApp()
}
