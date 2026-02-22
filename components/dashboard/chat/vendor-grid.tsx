"use client"

import { useState } from "react";
import { VendorOption } from "./types";
import { Stars, Tag } from "./chat-elements";

export const VendorGrid = () => {
    const [selected, setSelected] = useState(0);
    const vendors: VendorOption[] = [
        { name: "The Vineyard Trio", genre: "Jazz / Bossa nova · Napa-based", price: "$2,800 / 2hr set", rating: "4.9", count: 62, stars: 5 },
        { name: "Coastal Strings", genre: "Acoustic pop / folk · Sonoma", price: "$3,200 / 2hr set", rating: "4.6", count: 41, stars: 4 },
        { name: "Aurelio Quartet", genre: "Classical / contemporary · SF", price: "$3,500 / 2hr set", rating: "5.0", count: 18, stars: 5 },
    ];
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3.5">
                {vendors.map((v, i) => (
                    <div
                        key={v.name}
                        onClick={() => setSelected(i)}
                        className={`rounded-lg p-3 cursor-pointer transition-all border
              ${i === selected
                                ? "bg-primary/10 border-primary"
                                : "bg-muted border-border hover:border-primary/40"
                            }`}
                    >
                        <div className="text-[13px] font-medium text-foreground mb-0.5">{v.name}</div>
                        <div className="text-[11px] text-muted-foreground">{v.genre}</div>
                        <div className="text-xs text-primary mt-1.5">{v.price}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                            <Stars n={v.stars} /> {v.rating} ({v.count})
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
                {["June 14 available", "Approved vendor", "Sound system included"].map(t => <Tag key={t}>{t}</Tag>)}
            </div>
        </>
    );
};
