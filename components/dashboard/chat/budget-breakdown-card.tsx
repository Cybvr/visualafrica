"use client";

import { SharedEvent } from "@/lib/types";

interface BudgetBreakdownCardProps {
    event?: SharedEvent;
}

const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0);
};

export const BudgetBreakdownCard = ({ event }: BudgetBreakdownCardProps) => {
    const totalBudget = Number(event?.budget || 0);
    const breakdown = event?.budgetBreakdown || [];
    const allocated = breakdown.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const remaining = Math.max(totalBudget - allocated, 0);
    const usedPercent = totalBudget > 0 ? Math.min(Math.round((allocated / totalBudget) * 100), 100) : 0;

    return (
        <div className="bg-muted border border-border rounded-xl p-4 mt-3.5">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="font-display text-base text-foreground">Budget Breakdown</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                        {event?.eventName || "Event budget plan"}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] tracking-widest uppercase text-muted-foreground">Total Budget</div>
                    <div className="text-sm font-semibold text-foreground">{formatAmount(totalBudget)}</div>
                </div>
            </div>

            {breakdown.length > 0 ? (
                <div className="space-y-2.5 mb-4">
                    {breakdown.map((item) => (
                        <div key={item.category} className="bg-card border border-border rounded-lg p-2.5">
                            <div className="flex items-center justify-between gap-2 text-[12px]">
                                <span className="font-medium text-foreground">{item.category}</span>
                                <span className="text-muted-foreground">{item.percent}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-1">
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden flex-1">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(item.percent, 100)}%` }} />
                                </div>
                                <span className="text-[12px] font-semibold text-foreground tabular-nums">{formatAmount(item.amount)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-3 border border-dashed border-border rounded-lg text-sm text-muted-foreground mb-4">
                    No budget allocations generated yet.
                </div>
            )}

            <div className="bg-card border border-border rounded-xl p-3.5">
                <div className="flex justify-between mb-2">
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground">Allocated</span>
                    <span className="font-display text-sm text-foreground">{usedPercent}%</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden mb-2.5">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${usedPercent}%` }} />
                </div>
                <div className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">Allocated: <span className="text-foreground font-medium">{formatAmount(allocated)}</span></span>
                    <span className="text-muted-foreground">Remaining: <span className="text-foreground font-medium">{formatAmount(remaining)}</span></span>
                </div>
            </div>
        </div>
    );
};
