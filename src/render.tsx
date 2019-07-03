import * as React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { BaseComponentProps } from '@models/BaseProps'
import { APIInfo, Data, ClashXData } from '@stores'
import App from '@containers/App'
import i18n from '@i18n'

function Store (props: BaseComponentProps) {
    return (
        <APIInfo.Provider>
            <Data.Provider>
                <ClashXData.Provider>
                    { props.children }
                </ClashXData.Provider>
            </Data.Provider>
        </APIInfo.Provider>
    )
}

export default function renderApp () {
    const rootEl = document.getElementById('root')
    const AppInstance = (
        <Store>
            <HashRouter>
                <I18nextProvider i18n={ i18n }>
                    <App />
                </I18nextProvider>
            </HashRouter>
        </Store>
    )

    render(AppInstance, rootEl)
}
