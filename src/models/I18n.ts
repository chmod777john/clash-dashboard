export interface I18nProps {
    t? (
        key: string,
        variables?: {
            [key: string]: any
        }
    ): string

    lng?: string
}
