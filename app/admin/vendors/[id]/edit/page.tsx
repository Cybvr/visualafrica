"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import VendorForm from "@/components/admin/VendorForm";
import { getVendorById, updateVendor } from "@/lib/firestore-service";
import { Vendor } from "@/lib/types";

export default function EditVendorPage() {
    const params = useParams();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            getVendorById(params.id as string).then(data => {
                setVendor(data);
                setLoading(false);
            });
        }
    }, [params.id]);

    const handleSubmit = async (data: any) => {
        if (params.id) {
            await updateVendor(params.id as string, data);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!vendor) {
        return <div className="p-8 text-center text-red-500 font-bold">Vendor not found</div>;
    }

    return <VendorForm initialData={vendor} onSubmit={handleSubmit} title={`Edit: ${vendor.name}`} />;
}
