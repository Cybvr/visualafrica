"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { vendors } from '../../../../lib/vendors-data';
import VendorDetail from './VendorDetail';

export default function VendorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const vendor = vendors.find(v => v.slug === slug);

    if (!vendor) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <h1 className="text-2xl font-bold">Vendor not found</h1>
                <button
                    onClick={() => router.push('/dashboard/explore')}
                    className="text-orange-600 font-bold"
                >
                    Back to Explore
                </button>
            </div>
        );
    }

    return <VendorDetail vendor={vendor} onBack={() => router.push('/dashboard/explore')} />;
}
