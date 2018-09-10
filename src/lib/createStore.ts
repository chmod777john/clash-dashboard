import { createHashHistory } from 'history'
import { configure } from 'mobx'
import { RouterStore, ConfigStore } from '@stores'

// prepare MobX stores
configure({ enforceActions: 'observed' })
const history = createHashHistory()

export const rootStores = {
    router: new RouterStore(history),
    config: new ConfigStore()
}

export const storeKeys = Object.keys(rootStores)
