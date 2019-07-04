import * as React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { Provider as Global } from '@stores'
import App from '@containers/App'
import i18n from '@i18n'

export default function renderApp () {
    const rootEl = document.getElementById('root')
    const AppInstance = (
        <Global>
            <HashRouter>
                <I18nextProvider i18n={ i18n }>
                    <App />
                </I18nextProvider>
            </HashRouter>
        </Global>
    )

    render(AppInstance, rootEl)
}
