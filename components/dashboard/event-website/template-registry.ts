import React from "react";
import { WEBSITE_TEMPLATES, WebsiteTemplate } from "@/lib/website-templates";
import { WebsiteTemplateProps } from "./templates/types";
import ClassicInviteTemplate from "./templates/ClassicInviteTemplate";
import MinimalScheduleTemplate from "./templates/MinimalScheduleTemplate";
import VibrantSpotlightTemplate from "./templates/VibrantSpotlightTemplate";

type WebsiteTemplateComponent = React.ComponentType<WebsiteTemplateProps>;

export const TEMPLATE_COMPONENTS: Record<WebsiteTemplate["id"], WebsiteTemplateComponent> = {
  classic: ClassicInviteTemplate,
  minimal: MinimalScheduleTemplate,
  vibrant: VibrantSpotlightTemplate,
};

export const DEFAULT_TEMPLATE_ID: WebsiteTemplate["id"] = WEBSITE_TEMPLATES[0].id;
