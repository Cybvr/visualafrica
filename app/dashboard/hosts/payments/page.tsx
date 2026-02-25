"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, DollarSign, Calendar, Download, Plus, Trash2, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Sample data - would come from a database in production
interface HostPayment {
    id: string;
    eventName: string;
    eventId: string;
    vendor: string;
    date: string;
    dueDate: string;
    amount: string;
    status: 'paid' | 'pending' | 'overdue' | 'processing';
    method: string;
}

interface PaymentMethod {
    id: string;
    type: 'card' | 'bank';
    cardBrand?: string;
    last4?: string;
    bankName?: string;
    accountNumber?: string;
    isDefault: boolean;
}

const SAMPLE_PAYMENTS: HostPayment[] = [
    {
        id: 'PAY-001',
        eventName: 'Chidi & Amaka Wedding',
        eventId: 'ev-001',
        vendor: 'Lagos Event Planners',
        date: '2025-02-10',
        dueDate: '2025-02-15',
        amount: '$1,500',
        status: 'paid',
        method: 'Visa •••• 4242'
    },
    {
        id: 'PAY-002',
        eventName: 'Chidi & Amaka Wedding',
        eventId: 'ev-001',
        vendor: 'Premium Caterers Lagos',
        date: '2025-02-12',
        dueDate: '2025-02-20',
        amount: '$3,750',
        status: 'pending',
        method: 'Visa •••• 4242'
    },
    {
        id: 'PAY-003',
        eventName: 'Tech Conference 2025',
        eventId: '1',
        vendor: 'Coastal Venue & Events',
        date: '2025-02-01',
        dueDate: '2025-02-05',
        amount: '$2,500',
        status: 'paid',
        method: 'Mastercard •••• 5555'
    },
];

const SAMPLE_PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'pm-1',
        type: 'card',
        cardBrand: 'Visa',
        last4: '4242',
        isDefault: true
    },
    {
        id: 'pm-2',
        type: 'card',
        cardBrand: 'Mastercard',
        last4: '5555',
        isDefault: false
    },
    {
        id: 'pm-3',
        type: 'bank',
        bankName: 'First Bank Nigeria',
        accountNumber: '••••••5678',
        isDefault: false
    }
];

export default function HostPaymentsPage() {
    const [activeTab, setActiveTab] = useState<'history' | 'methods'>('history');
    const [searchQuery, setSearchQuery] = useState('');

    // Calculate payment stats
    const totalSpent = SAMPLE_PAYMENTS
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, '')), 0);

    const pendingAmount = SAMPLE_PAYMENTS
        .filter(p => p.status === 'pending' || p.status === 'processing')
        .reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, '')), 0);

    const thisMonth = SAMPLE_PAYMENTS
        .filter(p => {
            const paymentDate = new Date(p.date);
            const now = new Date();
            return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, '')), 0);

    // Filter payments based on search query
    const filteredPayments = SAMPLE_PAYMENTS.filter((payment) => {
        const query = searchQuery.toLowerCase();
        return (
            payment.eventName.toLowerCase().includes(query) ||
            payment.vendor.toLowerCase().includes(query) ||
            payment.id.toLowerCase().includes(query) ||
            payment.amount.toLowerCase().includes(query)
        );
    });

    const getStatusBadge = (status: HostPayment['status']) => {
        const configs = {
            paid: {
                icon: CheckCircle,
                text: 'Paid',
                className: 'bg-green-50 text-green-700 border-green-200'
            },
            pending: {
                icon: Clock,
                text: 'Pending',
                className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
            },
            processing: {
                icon: Clock,
                text: 'Processing',
                className: 'bg-blue-50 text-blue-700 border-blue-200'
            },
            overdue: {
                icon: AlertCircle,
                text: 'Overdue',
                className: 'bg-red-50 text-red-700 border-red-200'
            }
        };

        const config = configs[status];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${config.className}`}>
                <Icon size={12} />
                {config.text}
            </span>
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-16">
            {/* Header */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-foreground">Payments</h2>
                    <p className="text-muted-foreground mt-1 font-medium">Manage your event payments and payment methods.</p>
                </div>

                {/* Payment Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                            <DollarSign size={20} className="text-primary" />
                        </div>
                        <p className="text-3xl font-black text-foreground">${totalSpent.toLocaleString('en-US')}</p>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                            <Clock size={20} className="text-yellow-600" />
                        </div>
                        <p className="text-3xl font-black text-foreground">₦{pendingAmount.toLocaleString('en-NG')}</p>
                        <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">This Month</p>
                            <Calendar size={20} className="text-green-600" />
                        </div>
                        <p className="text-3xl font-black text-foreground">${thisMonth.toLocaleString('en-US')}</p>
                        <p className="text-xs text-muted-foreground mt-1">February 2026</p>
                    </div>
                </div>
            </div>

            {/* Ticket Sales */}
            <div className="space-y-3">
                <h3 className="text-2xl font-black text-foreground">Ticket Sales</h3>
                <div className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center -space-x-3">
                            <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center text-xl font-black">
                                ✦
                            </div>
                            <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-sm font-black text-muted-foreground">
                                +
                            </div>
                            <div className="w-12 h-12 rounded-full bg-[#635BFF] text-white flex items-center justify-center text-xs font-black uppercase">
                                Stripe
                            </div>
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-foreground">Start Selling Tickets</h4>
                            <p className="text-muted-foreground mt-1 max-w-xl">
                                Start selling tickets to your events by creating a Stripe account. It usually takes less than 5 minutes to set up.
                            </p>
                        </div>
                    </div>
                    <div>
                        <Button className="rounded-2xl px-8 py-6 text-base font-black bg-foreground text-background hover:bg-foreground/90">
                            Get Started
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">
                    Stripe is a secure payment processor with low fees that handles all ticket sales.
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 text-sm font-black transition-all border-b-2 ${activeTab === 'history'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Payment History
                    </button>
                    <button
                        onClick={() => setActiveTab('methods')}
                        className={`pb-3 text-sm font-black transition-all border-b-2 ${activeTab === 'methods'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Payment Methods
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'history' ? (
                <div className="space-y-4">
                    {/* Search and Actions */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by event, vendor, or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline" className="gap-2 font-bold">
                            <Download size={16} />
                            Export CSV
                        </Button>
                    </div>

                    {/* Payment History Table */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        {filteredPayments.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-black">Event</TableHead>
                                        <TableHead className="font-black">Vendor</TableHead>
                                        <TableHead className="font-black">Payment Date</TableHead>
                                        <TableHead className="font-black">Due Date</TableHead>
                                        <TableHead className="font-black">Method</TableHead>
                                        <TableHead className="font-black">Status</TableHead>
                                        <TableHead className="font-black text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPayments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                <Link
                                                    href={`/dashboard/hosts/events/${payment.eventId}`}
                                                    className="font-bold text-foreground hover:text-primary transition-colors"
                                                >
                                                    {payment.eventName}
                                                </Link>
                                                <p className="text-xs text-muted-foreground mt-0.5">ID: {payment.id}</p>
                                            </TableCell>
                                            <TableCell className="font-medium">{payment.vendor}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {payment.date}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {payment.dueDate}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <CreditCard size={12} />
                                                    {payment.method}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                            <TableCell className="text-right font-black text-lg">{payment.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-20">
                                <CreditCard size={48} className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-xl font-bold text-foreground">
                                    {searchQuery ? 'No payments found' : 'No Payment History'}
                                </h3>
                                <p className="text-muted-foreground mt-2 font-medium">
                                    {searchQuery
                                        ? 'Try adjusting your search query'
                                        : 'Vendor payments for your events will appear here.'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Results count */}
                    {SAMPLE_PAYMENTS.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredPayments.length} of {SAMPLE_PAYMENTS.length} payments
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Actions */}
                    <div className="flex items-center justify-end">
                        <Button className="gap-2 font-bold bg-primary hover:bg-primary/90">
                            <Plus size={16} />
                            Add Payment Method
                        </Button>
                    </div>

                    {/* Payment Methods List */}
                    <div className="space-y-3">
                        {SAMPLE_PAYMENT_METHODS.map((method) => (
                            <div
                                key={method.id}
                                className="bg-card border border-border rounded-xl p-6 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <CreditCard size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-foreground">
                                                {method.type === 'card'
                                                    ? `${method.cardBrand} •••• ${method.last4}`
                                                    : method.bankName
                                                }
                                            </h3>
                                            {method.isDefault && (
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                                                    DEFAULT
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {method.type === 'card' ? 'Credit/Debit Card' : `Account: ${method.accountNumber}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!method.isDefault && (
                                        <Button variant="outline" size="sm" className="font-bold">
                                            Set as Default
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info Box */}
                    <div className="bg-secondary border border-border rounded-xl p-6">
                        <h4 className="text-sm font-bold text-foreground mb-2">Payment Security</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            All payments are processed securely through our payment partners. Your payment information is encrypted and never stored on our servers.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
