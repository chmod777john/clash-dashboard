import * as React from 'react'
import { translate } from 'react-i18next'
import classnames from 'classnames'
import { BaseComponentProps, Proxy as IProxy, I18nProps, TagColors } from '@models'
import { Modal, Row, Col } from '@components'
import { getLocalStorageItem, setLocalStorageItem } from '@lib/helper'
import './style.scss'

interface ModifyProxyDialogProps extends BaseComponentProps, I18nProps {
    config: IProxy
    onOk?: (config: IProxy) => void
    onCancel?: () => void
}

interface ModifyProxyDialogState {
    config: IProxy
    currentColor: string
}

class RawDialog extends React.Component<ModifyProxyDialogProps, ModifyProxyDialogState> {

    constructor (props: ModifyProxyDialogProps) {
        super(props)

        this.state = {
            config: props.config,
            currentColor: getLocalStorageItem(props.config.name)
        }
    }

    componentDidMount () {
        console.log(this.props.config)
    }

    handleOk = () => {
        const { onOk } = this.props
        const { config, currentColor } = this.state
        setLocalStorageItem(config.name, currentColor)

        onOk(config)
    }

    render () {
        const { onCancel, t } = this.props
        const { currentColor } = this.state

        return <Modal
            className="proxy-editor"
            title={t('editDialog.title')}
            onOk={this.handleOk}
            onClose={onCancel}
        >
            <Row gutter={24} style={{ padding: '12px 0' }}>
                <Col span={6} style={{ paddingLeft: 0 }}>{t('editDialog.color')}</Col>
                <Col span={18}>
                    <div className="proxy-editor-color-selector">
                        {
                            TagColors.map(color => (
                                <span
                                    className={classnames('color-item', {
                                        'color-item-active': currentColor === color
                                    })}
                                    key={color}
                                    style={{ background: color }}
                                    onClick={() => this.setState({ currentColor: color })}
                                />
                            ))
                        }
                    </div>
                </Col>
            </Row>
        </Modal>
    }
}

export const ModifyProxyDialog = translate(['Proxies'])(RawDialog)
