import * as React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider as Global } from '@stores'
import App from '@containers/App'

export default function renderApp () {
    const rootEl = document.getElementById('root')
    const AppInstance = (
        <Global>
            <HashRouter>
                <App />
            </HashRouter>
        </Global>
    )

    render(AppInstance, rootEl)
}
