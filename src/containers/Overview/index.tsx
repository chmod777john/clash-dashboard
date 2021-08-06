import * as React from 'react'

import logo from '@assets/logo-fixing.svg'

export default function Overview () {
    return (
        <div style={{
            height: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            opacity: 0.3,
        }}>
            <img src={logo} alt="Logo" style={{
                width: 200,
            }}/>

            <h1 style={{ color: '#54759A', marginTop: 20 }}>Coming Soon...</h1>
        </div>
    )
}
