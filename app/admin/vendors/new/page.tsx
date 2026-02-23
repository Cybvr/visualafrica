"use client";

import VendorForm from "@/components/admin/VendorForm";
import { addVendor } from "@/lib/firestore-service";

export default function NewVendorPage() {
    const handleSubmit = async (data: any) => {
        const vendorData = {
            ...data,
            ownerId: "admin",
            rating: 5.0,
            gallery: [],
            whatsIncluded: [],
            services: [],
            stats: {
                eventsPlanned: "0",
                satisfiedClients: "0",
                corporateEvents: "0",
                yearsExperience: "0",
                uniqueLocations: "0"
            },
            vendor: {
                name: data.name,
                logo: "https://api.dicebear.com/7.x/initials/svg?seed=" + data.name,
                since: new Date().getFullYear().toString()
            }
        };
        await addVendor(vendorData);
    };

    return <VendorForm onSubmit={handleSubmit} title="Add New Vendor" />;
}
