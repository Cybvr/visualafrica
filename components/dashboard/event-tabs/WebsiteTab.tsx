"use client";

import React, { useState } from "react";
import { SharedEvent } from "@/lib/types";
import { WEBSITE_TEMPLATES, WebsiteTemplate } from "@/lib/website-templates";
import {
  DEFAULT_TEMPLATE_ID,
  TEMPLATE_COMPONENTS,
} from "@/components/dashboard/event-website/template-registry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WebsiteTabProps {
  event: SharedEvent;
}

const WebsiteTab: React.FC<WebsiteTabProps> = ({ event }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<WebsiteTemplate["id"]>(
    DEFAULT_TEMPLATE_ID
  );

  const selectedTemplate =
    WEBSITE_TEMPLATES.find((template) => template.id === selectedTemplateId) ??
    WEBSITE_TEMPLATES[0];
  const TemplateComponent = TEMPLATE_COMPONENTS[selectedTemplate.id];

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-border/50 pb-2 gap-3">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">Website Preview</h3>
        <Select
          value={selectedTemplateId}
          onValueChange={(value) => setSelectedTemplateId(value as WebsiteTemplate["id"])}
        >
          <SelectTrigger className="h-8 w-[160px] rounded-md text-xs text-foreground border-border/70">
            <SelectValue placeholder="Select Template" />
          </SelectTrigger>
          <SelectContent className="bg-card text-foreground">
            {WEBSITE_TEMPLATES.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg overflow-y-auto max-h-[70vh]">
        <TemplateComponent event={event} />
      </div>
    </div>
  );
};

export default WebsiteTab;
