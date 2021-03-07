import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import App from '@containers/App'
import 'windi.css'

export default function renderApp () {
    const rootEl = document.getElementById('root')
    const AppInstance = (
        <RecoilRoot>
            <HashRouter>
                <App />
            </HashRouter>
        </RecoilRoot>
    )

    render(AppInstance, rootEl)
}
