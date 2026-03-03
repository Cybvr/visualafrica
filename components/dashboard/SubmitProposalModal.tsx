"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { X, DollarSign, FileText, Calendar, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SubmitProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventName: string;
    eventId: string;
    onSubmit?: (proposalData: ProposalData) => void;
}

export interface ProposalData {
    quotedPrice: string;
    deliveryTimeline: string;
    message: string;
    attachments?: File[];
}

export const SubmitProposalModal: React.FC<SubmitProposalModalProps> = ({
    isOpen,
    onClose,
    eventName,
    eventId,
    onSubmit
}) => {
    const buildProposalTemplateText = useCallback(() => {
        const vendorDisplayName = auth.currentUser?.displayName?.trim() || 'Vendor';
        return `Hi,
I'm interested in vending at ${eventName || "this event"}. We offer our products/services and based on your expected crowd, we think we'd be a natural fit. You can check us out here: [Instagram/website link].
Is vendor space still available? Happy to move forward whenever you're ready.
— ${vendorDisplayName}`;
    }, [eventName]);

    const proposalTemplateText = buildProposalTemplateText();
    const [quotedPrice, setQuotedPrice] = useState('');
    const [deliveryTimeline, setDeliveryTimeline] = useState('');
    const [message, setMessage] = useState(proposalTemplateText);
    const [attachments, setAttachments] = useState<File[]>([]);
    const deliveryTimelineOptions = [
        "1-2 days",
        "3-5 days",
        "1 week",
        "2 weeks",
        "3-4 weeks",
        "1-2 months",
        "Flexible (depends on scope)",
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!deliveryTimeline) return;

        const proposalData: ProposalData = {
            quotedPrice,
            deliveryTimeline,
            message,
            attachments
        };

        if (onSubmit) {
            onSubmit(proposalData);
        }

        // Close modal and reset form
        onClose();
        setQuotedPrice('');
        setDeliveryTimeline('');
        setMessage(buildProposalTemplateText());
        setAttachments([]);
    };

    useEffect(() => {
        if (isOpen) {
            setMessage(buildProposalTemplateText());
        }
    }, [isOpen, buildProposalTemplateText]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Submit Proposal</h2>
                        <p className="text-sm text-muted-foreground mt-1">For: {eventName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Quoted Price */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-foreground">
                            <DollarSign size={16} className="inline mr-1" />
                            Your Quoted Price
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                            <input
                                type="number"
                                value={quotedPrice}
                                onChange={(e) => setQuotedPrice(e.target.value)}
                                placeholder="0.00"
                                required
                                className="w-full pl-8 pr-4 py-3 bg-secondary border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Enter your total quote for this event</p>
                    </div>

                    {/* Delivery Timeline */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-foreground">
                            <Calendar size={16} className="inline mr-1" />
                            Delivery Timeline
                        </label>
                        <Select value={deliveryTimeline} onValueChange={setDeliveryTimeline}>
                            <SelectTrigger className="w-full h-12 rounded-xl bg-secondary border-border font-medium">
                                <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {deliveryTimelineOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">When can you complete this service?</p>
                    </div>

                    {/* Message/Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-foreground">
                            <FileText size={16} className="inline mr-1" />
                            Proposal Details
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={6}
                            className="w-full px-4 py-3 bg-secondary border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                        />
                        <p className="text-xs text-muted-foreground">Explain your proposal in detail</p>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-foreground">
                            <Upload size={16} className="inline mr-1" />
                            Attachments (Optional)
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-primary/90 file:cursor-pointer"
                            />
                        </div>
                        {attachments.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {attachments.length} file(s) selected
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 py-6 font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!deliveryTimeline}
                            className="flex-1 py-6 font-bold bg-primary hover:bg-primary/90"
                        >
                            Submit Proposal
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
