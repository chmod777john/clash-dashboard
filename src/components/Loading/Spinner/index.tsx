import classnames from 'classnames'

import { type BaseComponentProps } from '@models/BaseProps'

import './style.scss'

type SpinnerProps = BaseComponentProps

export function Spinner (props: SpinnerProps) {
    const classname = classnames('spinner', props.className)

    return (
        <div className={classname}>
            <div className="spinner-circle">
                <div className="spinner-inner"></div>
            </div>
            <div className="spinner-circle">
                <div className="spinner-inner"></div>
            </div>
            <div className="spinner-circle">
                <div className="spinner-inner"></div>
            </div>
            <div className="spinner-circle">
                <div className="spinner-inner"></div>
            </div>
            <div className="spinner-circle">
                <div className="spinner-inner"></div>
            </div>
        </div>
    )
}
