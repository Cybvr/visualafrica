import Image from "next/image";
import { cn } from "@/lib/utils";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface DealBannerCardProps {
    title: string;
    description: string;
    image: string;
    tooltip?: string;
    eyebrow?: string;
    imageClassName?: string;
    className?: string;
    onClick?: () => void;
}

export function DealBannerCard({
    title,
    description,
    image,
    tooltip,
    eyebrow,
    imageClassName,
    className,
    onClick,
}: DealBannerCardProps) {
    const CardContent = (
        <div
            onClick={onClick}
            className={cn(
                "group flex items-center gap-3 p-2 bg-card rounded-2xl border border-border shadow-sm max-w-[340px] w-full transition-all hover:shadow-md cursor-pointer active:scale-[0.98]",
                className
            )}
        >
            <div
                className={cn(
                    "relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ease-out",
                    imageClassName ?? "h-12 w-12 group-hover:h-16 group-hover:w-16"
                )}
            >
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                />
            </div>
            <div className="flex flex-col text-left justify-center overflow-hidden">
                {eyebrow && (
                    <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                        {eyebrow}
                    </span>
                )}
                <h3 className="text-sm font-bold text-foreground leading-tight truncate">
                    {title}
                </h3>
                <p className="text-muted-foreground text-[12px] leading-tight line-clamp-2">
                    {description}
                </p>
            </div>
        </div>
    );

    if (!tooltip) return CardContent;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {CardContent}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}