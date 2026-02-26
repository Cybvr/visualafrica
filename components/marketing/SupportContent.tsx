"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Mail, MessageCircle, Sparkles } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FAQ, FAQCategory } from "@/lib/types"

import SupportChat from "@/components/dashboard/SupportChat"

interface SupportContentProps {
    faqs: FAQ[]
    categories: FAQCategory[]
}

export default function SupportContent({ faqs, categories }: SupportContentProps) {
    return (
        <div className="w-full flex justify-center">
            <SupportChat faqs={faqs} categories={categories} className="h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)]" />
        </div>
    )
}
