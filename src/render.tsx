import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { AppContainer } from 'react-hot-loader'
import App from '@views/App'
import i18n from '@i18n'

const rootEl = document.getElementById('root')

// Hot Module Replacement API
declare let module: { hot: any }

export default function renderApp () {
    render(
        <AppContainer>
            <BrowserRouter>
                <I18nextProvider i18n={ i18n }>
                    <App />
                </I18nextProvider>
            </BrowserRouter>
        </AppContainer>,
        rootEl
    )

    if (module.hot) {
        module.hot.accept('./views/App', () => {
            const NewApp = require('./views/App').default
            render(
                <AppContainer>
                    <BrowserRouter>
                        <I18nextProvider i18n={ i18n }>
                            <NewApp />
                        </I18nextProvider>
                    </BrowserRouter>
                </AppContainer>,
                rootEl
            )
        })
    }
}
