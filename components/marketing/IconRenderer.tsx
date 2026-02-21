import {
    Search,
    CalendarCheck,
    Activity,
    CreditCard,
    ShieldCheck,
    Zap,
    Globe,
    Users,
    Home,
    FileText,
    MessageSquare
} from "lucide-react"

const ICON_MAP = {
    Search,
    CalendarCheck,
    Activity,
    CreditCard,
    ShieldCheck,
    Zap,
    Globe,
    Users,
    Home,
    FileText,
    MessageSquare
}

interface IconRendererProps {
    name: string
    className?: string
}

export function IconRenderer({ name, className }: IconRendererProps) {
    const Icon = (ICON_MAP as any)[name] || Zap
    return <Icon className={className} />
}
