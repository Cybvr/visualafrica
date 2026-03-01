import React, { useState } from 'react';
import { Loader2, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TeamMember, SharedEvent } from '@/lib/types';
import { updateEvent } from '@/lib/firestore-service';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

interface ShareEventDialogProps {
    event: SharedEvent;
    teamMembers: TeamMember[];
    hostPhoto?: string | null;
}

export function ShareEventDialog({ event, teamMembers, hostPhoto }: ShareEventDialogProps) {
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

    const sharedMembers = teamMembers.filter(m => sharedWith.includes(m.email));
    const displayMembers = sharedMembers.slice(0, 2);
    const extraCount = sharedMembers.length > 2 ? sharedMembers.length - 2 : 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex -space-x-2 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    {/* Host Avatar */}
                    <Avatar className="h-10 w-10 border-2 border-background ring-0">
                        <AvatarImage src={hostPhoto || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                            {event.hostName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {/* Shared Members */}
                    {displayMembers.map((member) => (
                        <Avatar key={member.id} className="h-10 w-10 border-2 border-background">
                            <AvatarFallback className="bg-secondary text-secondary-foreground font-bold text-xs">
                                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    ))}

                    {/* Extra Count */}
                    {extraCount > 0 && (
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center border-2 border-background relative z-10 transition-colors">
                            <span className="text-[10px] font-bold text-muted-foreground">+{extraCount}</span>
                        </div>
                    )}

                    {/* Plus Button */}
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center border-2 border-background relative z-20 hover:bg-secondary/80 transition-colors">
                        <Plus size={16} className="text-muted-foreground" />
                    </div>
                </div>
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
