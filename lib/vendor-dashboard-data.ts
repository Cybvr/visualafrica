import { SharedEvent, Lead, Booking, PaymentHistory, PaymentMethod, Vendor, PortfolioItem, Chat } from './types';
export type { Booking, PaymentHistory, PortfolioItem } from './types';

const CURRENT_VENDOR_ID = "v1";

export function getCurrentVendor(allVendors: Vendor[]): Vendor | undefined {
    return allVendors.find(v => v.id === CURRENT_VENDOR_ID);
}

// Helper functions for payment calculations
export function getPaymentStats(payments: PaymentHistory[]) {
    const completed = payments.filter(p => p.status === 'completed');
    const pending = payments.filter(p => p.status === 'pending' || p.status === 'processing');

    const parseAmount = (amount: string) => {
        return parseFloat(amount.replace(/[NGN₦$,]/g, '').trim()) || 0;
    };

    const totalEarned = completed.reduce((sum, p) => sum + parseAmount(p.amount), 0);
    const pendingAmount = pending.reduce((sum, p) => sum + parseAmount(p.amount), 0);

    return {
        totalEarned,
        pendingAmount,
        thisMonth: totalEarned
    };
}

export const VENDOR_DASHBOARD_DATA = {
    currentVendorId: CURRENT_VENDOR_ID,
    // These will now be empty or handled by components fetching from Firestore
    leads: [] as Lead[],
    bookings: [] as Booking[],
    payments: [] as PaymentHistory[],
    paymentMethods: [
        {
            id: 'bank-001',
            type: 'bank' as const,
            bankName: 'First Bank of Nigeria',
            accountNumber: '****6789',
            isDefault: true
        }
    ] as PaymentMethod[],
    portfolioItems: [] as PortfolioItem[],
    chats: [] as Chat[],
    stats: {
        monthlyRevenue: "$0",
        growth: 0,
        activeBookings: 0,
        avgRating: 0
    }
};
