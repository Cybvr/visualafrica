import { UserProfile, UserRole } from "./types";

export type SubscriptionPlan = "free" | "pro" | "max" | "admin";

export type MessageQuota = {
    plan: SubscriptionPlan;
    role: UserRole | null;
    limit: number | null;
    used: number;
    remaining: number | null;
    periodKey: number;
    resetAt: string;
    isUnlimited: boolean;
};

export const MESSAGE_LIMITS: Record<Exclude<SubscriptionPlan, "admin">, number> = {
    free: 15,
    pro: 50,
    max: 1000,
};

export function getCurrentPeriodKey(date: Date = new Date()): number {
    return date.getUTCFullYear() * 100 + (date.getUTCMonth() + 1);
}

export function getNextPeriodStartIso(date: Date = new Date()): string {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const next = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));
    return next.toISOString();
}

export function normalizePlan(profile?: Partial<UserProfile> | null): SubscriptionPlan {
    const raw = String(profile?.subscriptionPlan || "").toLowerCase();
    if (raw === "free" || raw === "pro" || raw === "max" || raw === "admin") return raw;
    return "free";
}

export function getPlanLimit(plan: SubscriptionPlan, role?: UserRole | null): number | null {
    if (role === "admin" || plan === "admin") return null;
    if (plan === "pro") return MESSAGE_LIMITS.pro;
    if (plan === "max") return MESSAGE_LIMITS.max;
    return MESSAGE_LIMITS.free;
}

export function buildMessageQuota(params: {
    profile?: Partial<UserProfile> | null;
    used: number;
    periodKey?: number;
    now?: Date;
}): MessageQuota {
    const now = params.now || new Date();
    const periodKey = params.periodKey ?? getCurrentPeriodKey(now);
    const plan = normalizePlan(params.profile || null);
    const role = params.profile?.role || null;
    const limit = getPlanLimit(plan, role);
    const used = Math.max(0, Number(params.used) || 0);
    const remaining = limit === null ? null : Math.max(0, limit - used);

    return {
        plan,
        role,
        limit,
        used,
        remaining,
        periodKey,
        resetAt: getNextPeriodStartIso(now),
        isUnlimited: limit === null,
    };
}
