import Image from "next/image";
import { cn } from "@/lib/utils";

export function HolidayEscapeCard({ className, onClick }: { className?: string; onClick?: () => void }) {
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
                    src="/images/holiday-escape.png"
                    alt="Holiday Escape"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col text-left justify-center overflow-hidden">
                <h3 className="text-sm font-bold text-foreground leading-tight truncate">
                    Holiday Escape
                </h3>
                <p className="text-muted-foreground text-[12px] leading-tight line-clamp-2">
                    Experience a new destination at an affordable price
                </p>
            </div>
        </div>
    );
}
