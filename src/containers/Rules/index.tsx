import * as React from 'react'
import { Header } from '@components'
import { translate } from 'react-i18next'
import { I18nProps } from '@models'

class Rules extends React.Component<I18nProps, {}> {
    render () {
        const { t } = this.props

        return (
            <div className="page">
                <Header title={t('title')} />
            </div>
        )
    }
}

export default translate(['Rules'])(Rules)
