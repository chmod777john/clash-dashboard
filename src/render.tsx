import * as React from 'react'
import { render } from 'react-dom'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { AppContainer } from 'react-hot-loader'
import { isClashX } from '@lib/jsBridge'
import App from '@views/App'
import i18n from '@i18n'

const rootEl = document.getElementById('root')
const Router = isClashX() ? HashRouter : BrowserRouter

// Hot Module Replacement API
declare let module: { hot: any }

export default function renderApp () {
    render(
        <AppContainer>
            <Router>
                <I18nextProvider i18n={ i18n }>
                    <App />
                </I18nextProvider>
            </Router>
        </AppContainer>,
        rootEl
    )

    if (module.hot) {
        module.hot.accept('./views/App', () => {
            const NewApp = require('./views/App').default
            render(
                <AppContainer>
                    <Router>
                        <I18nextProvider i18n={ i18n }>
                            <NewApp />
                        </I18nextProvider>
                    </Router>
                </AppContainer>,
                rootEl
            )
        })
    }
}
