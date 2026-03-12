import Image from "next/image";
import { cn } from "@/lib/utils";

interface DealBannerCardProps {
    title: string;
    description: string;
    image: string;
    className?: string;
    onClick?: () => void;
}

export function DealBannerCard({ title, description, image, className, onClick }: DealBannerCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 p-2 bg-card rounded-2xl border border-border shadow-sm max-w-[340px] w-full transition-all hover:shadow-md cursor-pointer active:scale-[0.98]",
                className
            )}
        >
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col text-left justify-center overflow-hidden">
                <h3 className="text-sm font-bold text-foreground leading-tight truncate">
                    {title}
                </h3>
                <p className="text-muted-foreground text-[12px] leading-tight line-clamp-2">
                    {description}
                </p>
            </div>
        </div>
    );
}
