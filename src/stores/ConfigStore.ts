import { observable, action, runInAction } from 'mobx'
import { parse } from 'ini'
import { Config } from '@models'
import { jsBridge } from '@lib/jsBridge'

export class ConfigStore {

    @observable
    config: Config = {}

    @observable
    public state: 'pending' | 'ok' | 'error' = 'pending'

    @action
    async fetchAndParseConfig () {
        this.state = 'pending'

        const rawConfig = await jsBridge.readConfigString()

        runInAction(() => {
            // emit error when config is empty
            // because read config might be error
            if (!rawConfig) {
                this.state = 'error'
                return
            }

            // otherwise parse ini
            const config = parse(rawConfig)

            console.log(config)

            this.config = config
            this.state = 'ok'
        })
    }

}
