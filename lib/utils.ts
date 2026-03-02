import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

type CurrencyFormatOptions = {
    currency?: string
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    notation?: Intl.NumberFormatOptions["notation"]
    compactDisplay?: Intl.NumberFormatOptions["compactDisplay"]
}

export const DEFAULT_CURRENCY = (process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD").toUpperCase()
export const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en-US"

export function formatCurrency(
    value: number | null | undefined,
    options: CurrencyFormatOptions = {},
) {
    if (typeof value !== "number" || Number.isNaN(value)) return ""

    const {
        currency = DEFAULT_CURRENCY,
        locale = DEFAULT_LOCALE,
        minimumFractionDigits = 0,
        maximumFractionDigits = 0,
        notation,
        compactDisplay,
    } = options

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
        notation,
        compactDisplay,
    }).format(value)
}

export function getCurrencySymbol(options: Pick<CurrencyFormatOptions, "currency" | "locale"> = {}) {
    const currency = options.currency || DEFAULT_CURRENCY
    const locale = options.locale || DEFAULT_LOCALE
    const parts = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).formatToParts(0)

    return parts.find((part) => part.type === "currency")?.value || currency
}
