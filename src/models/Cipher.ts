/**
 * ss ciphers which clash supported
 * @see https://github.com/Dreamacro/go-shadowsocks2/blob/master/core/cipher.go
 */
export const SsCipher = [
    // AEAD ciphers
    'AEAD_AES_128_GCM',
    'AEAD_AES_192_GCM',
    'AEAD_AES_256_GCM',
    'AEAD_CHACHA20_POLY1305',
    'AEAD_XCHACHA20_POLY1305',

    // stream ciphers
    'RC4-MD5',
    'AES-128-CTR',
    'AES-192-CTR',
    'AES-256-CTR',
    'AES-128-CFB',
    'AES-192-CFB',
    'AES-256-CFB',
    'CHACHA20',
    'CHACHA20-IETF',
    'XCHACHA20',
]

/**
 * vmess ciphers which clash supported
 * @see https://github.com/Dreamacro/clash/blob/master/component/vmess/vmess.go#L34
 */
export const VmessCipher = [
    'auto',
    'none',
    'aes-128-gcm',
    'chacha20-poly1305',
]

/**
 * pickCipherWithAlias returns a cipher of the given name.
 */
export function pickCipherWithAlias (c: string) {
    const cipher = c.toUpperCase()

    switch (cipher) {
        case 'CHACHA20-IETF-POLY1305':
            return 'AEAD_CHACHA20_POLY1305'
        case 'XCHACHA20-IETF-POLY1305':
            return 'AEAD_XCHACHA20_POLY1305'
        case 'AES-128-GCM':
            return 'AEAD_AES_128_GCM'
        case 'AES-196-GCM':
            return 'AEAD_AES_196_GCM'
        case 'AES-256-GCM':
            return 'AEAD_AES_256_GCM'
    }

    return SsCipher.find(c => c === cipher) ?? ''
}
