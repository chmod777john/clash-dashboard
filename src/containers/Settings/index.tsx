import * as React from 'react'
import { Header, Card } from '@components'
import { translate } from 'react-i18next'
import { I18nProps } from '@i18n'

class Settings extends React.Component<I18nProps, {}> {

    state = {
        startAtLogin: false
    }

    render () {
        const { t } = this.props

        return (
            <div className="page">
                <Header title={t('title')} />
                <Card style={{ marginTop: 25 }}>
                </Card>
            </div>
        )
    }
}

export default translate(['Settings'])(Settings)
