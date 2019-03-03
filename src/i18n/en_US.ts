export default {
    SideBar: {
        Proxies: 'Proxies',
        Overview: 'Overview',
        Logs: 'Logs',
        Rules: 'Rules',
        Settings: 'Setting'
    },
    Settings: {
        title: 'Settings',
        labels: {
            startAtLogin: 'Start at login',
            language: 'language',
            setAsSystemProxy: 'Set as system proxy',
            allowConnectFromLan: 'Allow connect from Lan',
            proxyMode: 'Mode',
            socks5ProxyPort: 'Socks5 proxy port',
            httpProxyPort: 'HTTP proxy port',
            externalController: 'External controller'
        },
        values: {
            cn: '中文',
            en: 'English',
            global: 'Global',
            rules: 'Rules',
            direct: 'Direct'
        },
        versionString: 'Current ClashX is the latest version：{{version}}',
        checkUpdate: 'Check Update',
        externalControllerSetting: {
            title: 'External Controller',
            note: 'Please note that modifying this configuration will only configure Dashboard. Will not modify your Clash configuration file. Please make sure that the external controller address matches the address in the Clash configuration file, otherwise, Dashboard will not be able to connect to Clash.',
            host: 'Host',
            port: 'Port',
            secret: 'Secret'
        }
    },
    Logs: {
        title: 'Logs'
    },
    Rules: {
        title: 'Rules'
    },
    Proxies: {
        title: 'Proxies',
        editDialog: {
            title: 'Edit Proxy',
            color: 'Color',
            name: 'Name',
            type: 'Type',
            server: 'Server',
            port: 'Port',
            password: 'Password',
            cipher: 'Cipher',
            obfs: 'Obfs',
            'obfs-host': 'Obfs-host',
            uuid: 'UUID',
            alterId: 'AlterId',
            tls: 'TLS'
        },
        groupTitle: 'Policy Group',
        expandText: 'Expand',
        collapseText: 'Collapse',
        speedTestText: 'Speed Test'
    }
}
