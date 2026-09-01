import React from 'react';
import { getVendorBySlug } from '@/lib/firestore-service';
import VendorDetail from './VendorDetail';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function VendorDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const vendor = await getVendorBySlug(slug);
    const plainVendor = vendor ? JSON.parse(JSON.stringify(vendor)) : null;

    if (!plainVendor) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <h1 className="text-2xl font-bold text-foreground">Vendor not found</h1>
                <Link
                    href="/dashboard/hosts/vendors"
                    className="text-primary font-bold hover:underline"
                >
                    Back to Explore
                </Link>
            </div>
        );
    }

    return <VendorDetail vendor={plainVendor} />;
}
