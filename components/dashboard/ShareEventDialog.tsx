import React, { useState } from 'react';
import { Share2, Loader2, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TeamMember, SharedEvent } from '@/lib/types';
import { updateEvent } from '@/lib/firestore-service';

interface ShareEventDialogProps {
    event: SharedEvent;
    teamMembers: TeamMember[];
}

export function ShareEventDialog({ event, teamMembers }: ShareEventDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [sharedWith, setSharedWith] = useState<string[]>(event.sharedWith || []);

    const handleToggle = (email: string) => {
        setSharedWith(prev =>
            prev.includes(email)
                ? prev.filter(e => e !== email)
                : [...prev, email]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateEvent(event.id, { sharedWith });
            setOpen(false);
        } catch (error) {
            console.error("Failed to share event:", error);
            alert("Failed to save sharing settings. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 rounded-xl px-4 font-bold border-border bg-card hover:bg-secondary/50">
                    <Share2 size={18} />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border rounded-3xl p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-black font-serif">
                        <Users size={24} className="text-primary" />
                        Share Event
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Select team members to give them access to this event.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {teamMembers.length === 0 ? (
                        <div className="p-4 text-center border rounded-xl bg-secondary/30">
                            <p className="text-sm text-muted-foreground">You haven't added any team members yet.</p>
                            <p className="text-xs text-muted-foreground mt-1">Go to Settings &gt; Team to add members.</p>
                        </div>
                    ) : (
                        teamMembers.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-xl">
                                <div>
                                    <p className="font-bold text-sm">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.email} • {member.role}</p>
                                </div>
                                <Checkbox
                                    checked={sharedWith.includes(member.email)}
                                    className="border-primary"
                                    onCheckedChange={() => handleToggle(member.email)}
                                />
                            </div>
                        ))
                    )}
                </div>

                <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 w-full">
                    <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 rounded-xl text-sm font-bold"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || teamMembers.length === 0}
                        className="flex-1 rounded-xl text-sm font-black shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        {isSaving ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
