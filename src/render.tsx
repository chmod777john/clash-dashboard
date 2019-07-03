import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import { HashRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { rootStores } from '@lib/createStore'
import { BaseComponentProps } from '@models/BaseProps'
import { APIInfo, Data, ClashXData, ExternalControllerModal } from '@stores'
import App from '@containers/App'
import i18n from '@i18n'

function Store (props: BaseComponentProps) {
    return (
        <APIInfo.Provider>
            <Data.Provider>
                <ClashXData.Provider>
                    <ExternalControllerModal.Provider>
                        { props.children }
                    </ExternalControllerModal.Provider>
                </ClashXData.Provider>
            </Data.Provider>
        </APIInfo.Provider>
    )
}

export default function renderApp () {
    const rootEl = document.getElementById('root')
    const AppInstance = (
        <Store>
            <Provider {...rootStores}>
                <HashRouter>
                    <I18nextProvider i18n={ i18n }>
                        <App />
                    </I18nextProvider>
                </HashRouter>
            </Provider>
        </Store>
    )

    render(AppInstance, rootEl)
}
