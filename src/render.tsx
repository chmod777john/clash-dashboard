import React, { Suspense } from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from '@containers/App'
import { Loading } from '@components'
import 'virtual:windi.css'

export default function renderApp () {
    const rootEl = document.getElementById('root')
    const AppInstance = (
        <HashRouter>
            <Suspense fallback={<Loading visible />}>
                <App />
            </Suspense>
        </HashRouter>
    )

    render(AppInstance, rootEl)
}
