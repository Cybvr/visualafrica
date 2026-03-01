"use client";

import React, { useState } from "react";
import { SharedEvent } from "@/lib/types";
import { WEBSITE_TEMPLATES, WebsiteTemplate } from "@/lib/website-templates";
import {
    DEFAULT_TEMPLATE_ID,
    TEMPLATE_COMPONENTS,
} from "@/components/dashboard/event-website/template-registry";

interface PublicEventClientProps {
    event: SharedEvent;
}

const PublicEventClient: React.FC<PublicEventClientProps> = ({ event }) => {
    const [selectedTemplateId] = useState<WebsiteTemplate["id"]>(
        DEFAULT_TEMPLATE_ID
    );

    const selectedTemplate =
        WEBSITE_TEMPLATES.find((template) => template.id === selectedTemplateId) ??
        WEBSITE_TEMPLATES[0];
    const TemplateComponent = TEMPLATE_COMPONENTS[selectedTemplate.id];

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-lg min-h-screen bg-card shadow-2xl overflow-hidden animate-in fade-in duration-700">
                <TemplateComponent event={event} />
            </div>
        </main>
    );
};

export default PublicEventClient;
