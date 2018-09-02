import * as React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'

const rootEl = document.getElementById('root')

// Hot Module Replacement API
declare let module: { hot: any }

export default function renderApp () {
    render(
        <AppContainer>
            <App />
        </AppContainer>,
        rootEl
    )

    if (module.hot) {
        module.hot.accept('./components/App', () => {
            const NewApp = require('./components/App').default
            render(
                <AppContainer>
                    <NewApp />
                </AppContainer>,
                rootEl
            )
        })
    }
}
