"use client";

import { useState } from 'react';
import { CreditCard, DollarSign, Calendar, Download, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaymentStatus = 'completed' | 'pending' | 'processing';

interface PaymentHistory {
    id: string;
    eventName: string;
    client: string;
    amount: string;
    date: string;
    status: PaymentStatus;
    method: string;
}

interface PaymentMethod {
    id: string;
    type: 'bank' | 'card';
    bankName?: string;
    cardLast4?: string;
    accountNumber?: string;
    isDefault: boolean;
}

export default function VendorPaymentsPage() {
    const [activeTab, setActiveTab] = useState<'history' | 'methods'>('history');

    // Mock payment history data
    const paymentHistory: PaymentHistory[] = [
        {
            id: 'pmt-001',
            eventName: 'Lagos Corporate Gala 2024',
            client: 'TechCorp Nigeria',
            amount: '$2,500.00',
            date: 'Feb 10, 2024',
            status: 'completed',
            method: 'Bank Transfer'
        },
        {
            id: 'pmt-002',
            eventName: 'Abuja Wedding Reception',
            client: 'Sarah & Michael',
            amount: '$1,800.00',
            date: 'Feb 5, 2024',
            status: 'completed',
            method: 'Bank Transfer'
        },
        {
            id: 'pmt-003',
            eventName: 'Port Harcourt Product Launch',
            client: 'StartupXYZ',
            amount: '$3,200.00',
            date: 'Feb 15, 2024',
            status: 'processing',
            method: 'Bank Transfer'
        },
        {
            id: 'pmt-004',
            eventName: 'Kano Birthday Celebration',
            client: 'Ahmed Family',
            amount: '$950.00',
            date: 'Feb 20, 2024',
            status: 'pending',
            method: 'Bank Transfer'
        }
    ];

    // Mock payment methods
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: 'bank-001',
            type: 'bank',
            bankName: 'First Bank of Nigeria',
            accountNumber: '****6789',
            isDefault: true
        },
        {
            id: 'bank-002',
            type: 'bank',
            bankName: 'GTBank',
            accountNumber: '****1234',
            isDefault: false
        }
    ]);

    const getStatusBadge = (status: PaymentStatus) => {
        const configs = {
            completed: {
                icon: CheckCircle,
                text: 'Completed',
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

    const totalEarned = paymentHistory
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')), 0);

    const pendingAmount = paymentHistory
        .filter(p => p.status === 'pending' || p.status === 'processing')
        .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')), 0);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-16">
            {/* Header */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-foreground">Payments</h2>
                    <p className="text-muted-foreground mt-1 font-medium">Track your earnings and manage payment methods.</p>
                </div>

                {/* Earnings Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                            <DollarSign size={20} className="text-green-600" />
                        </div>
                        <p className="text-3xl font-black text-foreground">${totalEarned.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                            <Clock size={20} className="text-yellow-600" />
                        </div>
                        <p className="text-3xl font-black text-foreground">${pendingAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">This Month</p>
                            <Calendar size={20} className="text-primary" />
                        </div>
                        <p className="text-3xl font-black text-foreground">$8,450</p>
                        <p className="text-xs text-muted-foreground mt-1">February 2024</p>
                    </div>
                </div>
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
                    {/* Actions */}
                    <div className="flex items-center justify-end">
                        <Button variant="outline" className="gap-2 font-bold">
                            <Download size={16} />
                            Export CSV
                        </Button>
                    </div>

                    {/* Payment History List */}
                    <div className="space-y-3">
                        {paymentHistory.map((payment) => (
                            <div
                                key={payment.id}
                                className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-foreground">{payment.eventName}</h3>
                                            {getStatusBadge(payment.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">Client: {payment.client}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {payment.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CreditCard size={12} />
                                                {payment.method}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-foreground">{payment.amount}</p>
                                        <p className="text-xs text-muted-foreground mt-1">ID: {payment.id}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                        {paymentMethods.map((method) => (
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
                                            <h3 className="text-lg font-bold text-foreground">{method.bankName}</h3>
                                            {method.isDefault && (
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                                                    DEFAULT
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Account: {method.accountNumber}</p>
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
                        <h4 className="text-sm font-bold text-foreground mb-2">Payment Processing</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Payments are processed within 3-5 business days after an event is completed. Make sure your payment method is up to date to avoid delays.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
