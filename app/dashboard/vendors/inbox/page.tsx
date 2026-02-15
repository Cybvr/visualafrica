"use client";

import React from 'react';
import VendorInboxTab from '@/components/dashboard/event-tabs/VendorInboxTab';

export default function VendorStandaloneInbox() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Inbox</h2>
        <p className="text-muted-foreground mt-1">Manage all your client communications in one place.</p>
      </div>
      <VendorInboxTab />
    </div>
  );
}