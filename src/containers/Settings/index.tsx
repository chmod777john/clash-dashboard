import React, { useEffect, useMemo } from 'react'
import classnames from 'classnames'
import { capitalize } from 'lodash-es'
import { Header, Card, Switch, ButtonSelect, ButtonSelectOptions, Input } from '@components'
import { useI18n, useClashXData, useAPIInfo, useGeneral, useIdentity, useVersion } from '@stores'
import { updateConfig } from '@lib/request'
import { useObject } from '@lib/hook'
import { jsBridge } from '@lib/jsBridge'
import { Lang } from '@i18n'
import './style.scss'

const languageOptions: ButtonSelectOptions[] = [{ label: '中文', value: 'zh_CN' }, { label: 'English', value: 'en_US' }]

export default function Settings () {
    const { premium } = useVersion()
    const { data: clashXData, update: fetchClashXData } = useClashXData()
    const { general, update: fetchGeneral } = useGeneral()
    const { set: setIdentity } = useIdentity()
    const { data: apiInfo } = useAPIInfo()
    const { translation, setLang, lang } = useI18n()
    const { t } = translation('Settings')
    const [info, set] = useObject({
        socks5ProxyPort: 7891,
        httpProxyPort: 7890,
        mixedProxyPort: 0
    })

    useEffect(() => {
        set('socks5ProxyPort', general?.socksPort ?? 0)
        set('httpProxyPort', general?.port ?? 0)
        set('mixedProxyPort', general?.mixedPort ?? 0)
    }, [general, set])

    async function handleProxyModeChange (mode: string) {
        await updateConfig({ mode })
        await fetchGeneral()
    }

    async function handleStartAtLoginChange (state: boolean) {
        await jsBridge?.setStartAtLogin(state)
        fetchClashXData()
    }

    async function handleSetSystemProxy (state: boolean) {
        await jsBridge?.setSystemProxy(state)
        fetchClashXData()
    }

    function changeLanguage (language: Lang) {
        setLang(language)
    }

    async function handleHttpPortSave () {
        await updateConfig({ port: info.httpProxyPort })
        await fetchGeneral()
    }

    async function handleSocksPortSave () {
        await updateConfig({ 'socks-port': info.socks5ProxyPort })
        await fetchGeneral()
    }

    async function handleMixedPortSave () {
        await updateConfig({ 'mixed-port': info.mixedProxyPort })
        await fetchGeneral()
    }

    async function handleAllowLanChange (state: boolean) {
        await updateConfig({ 'allow-lan': state })
        await fetchGeneral()
    }

    const {
        hostname: externalControllerHost,
        port: externalControllerPort
    } = apiInfo

    const { allowLan, mode } = general

    const startAtLogin = clashXData?.startAtLogin ?? false
    const systemProxy = clashXData?.systemProxy ?? false
    const isClashX = clashXData?.isClashX ?? false

    const proxyModeOptions = useMemo(() => {
        const options = [
            { label: t('values.global'), value: 'Global' },
            { label: t('values.rules'), value: 'Rule' },
            { label: t('values.direct'), value: 'Direct' }
        ]
        if (premium) {
            options.push({ label: t('values.script'), value: 'Script' })
        }
        return options
    }, [t, premium])

    return (
        <div className="page">
            <Header title={t('title')} />
            <Card className="settings-card">
                <div className="flex flex-wrap">
                    <div className="w-full flex md:w-1/2 items-center justify-between px-8 py-3">
                        <span className="label font-bold">{t('labels.startAtLogin')}</span>
                        <Switch disabled={!clashXData?.isClashX} checked={startAtLogin} onChange={handleStartAtLoginChange} />
                    </div>
                    <div className="w-full flex md:w-1/2 items-center justify-between px-8 py-3">
                        <span className="label font-bold">{t('labels.language')}</span>
                        <ButtonSelect options={languageOptions} value={lang} onSelect={(lang) => changeLanguage(lang as Lang)} />
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="w-full flex md:w-1/2 items-center justify-between px-8 py-3">
                        <span className="label font-bold">{t('labels.setAsSystemProxy')}</span>
                        <Switch
                            disabled={!isClashX}
                            checked={systemProxy}
                            onChange={handleSetSystemProxy}
                        />
                    </div>
                    <div className="w-full flex md:w-1/2 items-center justify-between px-8 py-3">
                        <span className="label font-bold">{t('labels.allowConnectFromLan')}</span>
                        <Switch checked={allowLan} onChange={handleAllowLanChange} />
                    </div>
                </div>
            </Card>

            <Card className="settings-card">
                <div className="flex flex-wrap">
                    <div className="w-full flex md:w-1/2 items-center justify-between px-8 py-3">
                        <span className="label font-bold">{t('labels.proxyMode')}</span>
                        <ButtonSelect
                            options={proxyModeOptions}
                            value={capitalize(mode)}
                            onSelect={handleProxyModeChange}
                        />
                    </div>
                    <div className="w-full flex md:w-1/2 items-center justify-between px-8 py-3">
                        <span className="label font-bold">{t('labels.socks5ProxyPort')}</span>
                        <Input
                            className="w-28"
                            disabled={isClashX}
                            value={info.socks5ProxyPort}
                            onChange={socks5ProxyPort => set('socks5ProxyPort', +socks5ProxyPort)}
                            onBlur={handleSocksPortSave}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="w-full flex md:w-1/2 items-center justify-between px-8 py-3">
                        <span className="label font-bold">{t('labels.httpProxyPort')}</span>
                        <Input
                            className="w-28"
                            disabled={isClashX}
                            value={info.httpProxyPort}
                            onChange={httpProxyPort => set('httpProxyPort', +httpProxyPort)}
                            onBlur={handleHttpPortSave}
                        />
                    </div>
                    <div className="w-full flex md:w-1/2 items-center justify-between px-8 py-3">
                        <span className="label font-bold">{t('labels.mixedProxyPort')}</span>
                        <Input
                            className="w-28"
                            disabled={isClashX}
                            value={info.mixedProxyPort}
                            onChange={mixedProxyPort => set('mixedProxyPort', +mixedProxyPort)}
                            onBlur={handleMixedPortSave}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="w-full flex md:w-1/2 items-center justify-between px-8 py-3">
                        <span className="label font-bold">{t('labels.externalController')}</span>
                        <span
                            className={classnames({ 'modify-btn': !isClashX }, 'external-controller')}
                            onClick={() => !isClashX && setIdentity(false)}>
                            {`${externalControllerHost}:${externalControllerPort}`}
                        </span>
                    </div>
                    <div className="w-1/2 px-8"></div>
                </div>
            </Card>
            {/* <Card className="clash-version hidden">
                <span className="check-icon">
                    <Icon type="check" size={20} />
                </span>
                <p className="version-info">{t('versionString')}</p>
                <span className="check-update-btn">{t('checkUpdate')}</span>
            </Card> */}
        </div>
    )
}
