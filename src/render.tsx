import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import { Loading } from '@components'
import App from '@containers/App'
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

    const root = createRoot(rootEl!)
    root.render(AppInstance)
}
