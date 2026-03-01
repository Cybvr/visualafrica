"use client";

import React, { useEffect, useState } from 'react';
import { Settings, User, Bell, Shield, CreditCard, HelpCircle, ChevronRight, Save, Loader2, Users, Plus, Trash2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HostPaymentsPage from '@/app/dashboard/hosts/payments/page';

const HostSettingsPage = () => {
    const [activeTab, setActiveTab] = useState<string>('Profile');
    const [user, setUser] = useState<any>(null);
    const [nickname, setNickname] = useState('');
    const [bio, setBio] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('Member');

    const menuItems = [
        { icon: User, label: 'Profile' },
        { icon: Users, label: 'Team' },
        { icon: Bell, label: 'Notifications' },
        { icon: Shield, label: 'Security' },
        { icon: CreditCard, label: 'Payments' },
        { icon: HelpCircle, label: 'Support' },
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) return;
            setUser(firebaseUser);

            // Load saved profile from Firestore
            const profileRef = doc(db, 'userProfiles', firebaseUser.uid);
            const snap = await getDoc(profileRef);
            if (snap.exists()) {
                const data = snap.data();
                setNickname(data.nickname || '');
                setBio(data.bio || '');
                setTeamMembers(data.teamMembers || []);
            } else {
                // Default to displayName from Google
                setNickname(firebaseUser.displayName || '');
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const profileRef = doc(db, 'userProfiles', user.uid);
            await setDoc(profileRef, {
                nickname: nickname.trim(),
                bio: bio.trim(),
                email: user.email,
                teamMembers,
                updatedAt: new Date().toISOString(),
            }, { merge: true });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("Failed to save. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddTeamMember = () => {
        if (!newMemberName.trim() || !newMemberEmail.trim()) return;
        const newMember = {
            id: Math.random().toString(36).substr(2, 9),
            name: newMemberName.trim(),
            email: newMemberEmail.trim().toLowerCase(),
            role: newMemberRole,
        };
        setTeamMembers([...teamMembers, newMember]);
        setNewMemberName('');
        setNewMemberEmail('');
        setNewMemberRole('Member');
        // Setting state is enough; the user will click "Save Changes" to persist.
    };

    const handleRemoveTeamMember = (id: string) => {
        setTeamMembers(teamMembers.filter(m => m.id !== id));
    };

    const initials = (nickname || user?.displayName || user?.email || 'U')
        .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <div>
                <h2 className="text-4xl font-serif font-black tracking-tight text-foreground">Settings</h2>
                <p className="text-muted-foreground font-medium mt-1">Manage your account preferences and dashboard configurations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1">
                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => setActiveTab(item.label)}
                                className={`w-full flex items-center justify-between px-5 py-4 text-sm font-black rounded-2xl transition-all ${activeTab === item.label
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                    : 'text-muted-foreground hover:bg-card hover:text-foreground'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} />
                                    {item.label}
                                </div>
                                {activeTab === item.label && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3">
                    <div className="bg-card border border-border rounded-[3rem] p-10 shadow-sm min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'Profile' && (
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-2xl font-serif font-black text-foreground mb-2">Personal Information</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Your nickname is what gets shown as the publisher name on kits you publish to the Store.</p>
                                </div>

                                <div className="flex items-center gap-6 pb-8 border-b border-border">
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-2xl uppercase">
                                        {initials}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">{user?.displayName || user?.email}</p>
                                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            Nickname / Store Handle
                                        </label>
                                        <Input
                                            value={nickname}
                                            onChange={e => setNickname(e.target.value)}
                                            placeholder="e.g. WedderJide, PartyKing"
                                            className="rounded-2xl px-5 py-4 h-auto text-sm font-bold"
                                        />
                                        <p className="text-[10px] text-muted-foreground">This is shown as "by [Nickname]" on your store kits.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                                        <Input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="rounded-2xl px-5 py-4 h-auto text-sm font-bold opacity-60"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bio</label>
                                        <textarea
                                            rows={3}
                                            value={bio}
                                            onChange={e => setBio(e.target.value)}
                                            placeholder="Tell us about yourself..."
                                            className="w-full px-6 py-4 bg-background border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-10 py-4 h-auto rounded-[2rem] text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        {isSaving ? (
                                            <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                        ) : saved ? (
                                            <>✓ Saved!</>
                                        ) : (
                                            <><Save size={18} /> Save Changes</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Team' && (
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-2xl font-serif font-black text-foreground mb-2">Team Management</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Add team members to give them access to specific events.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <h4 className="text-sm font-bold mb-4">Add New Member</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Input
                                                value={newMemberName}
                                                onChange={e => setNewMemberName(e.target.value)}
                                                placeholder="Name"
                                                className="rounded-xl"
                                            />
                                            <Input
                                                type="email"
                                                value={newMemberEmail}
                                                onChange={e => setNewMemberEmail(e.target.value)}
                                                placeholder="Email Address"
                                                className="rounded-xl"
                                            />
                                            <div className="flex gap-2">
                                                <select
                                                    value={newMemberRole}
                                                    onChange={e => setNewMemberRole(e.target.value)}
                                                    className="flex-1 bg-background border border-border rounded-xl px-3 text-sm font-medium outline-none"
                                                >
                                                    <option>Admin</option>
                                                    <option>Member</option>
                                                    <option>Viewer</option>
                                                </select>
                                                <Button onClick={handleAddTeamMember} className="rounded-xl shrink-0">
                                                    <Plus size={18} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold mb-4">Current Team Members</h4>
                                        {teamMembers.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No team members added yet.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {teamMembers.map((member) => (
                                                    <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-2xl gap-4">
                                                        <div>
                                                            <p className="font-bold text-sm">{member.name}</p>
                                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full">
                                                                {member.role}
                                                            </span>
                                                            <button
                                                                onClick={() => handleRemoveTeamMember(member.id)}
                                                                className="text-destructive hover:text-destructive/80 p-2"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-10 py-4 h-auto rounded-[2rem] text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        {isSaving ? (
                                            <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                        ) : saved ? (
                                            <>✓ Saved!</>
                                        ) : (
                                            <><Save size={18} /> Save Changes</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Payments' && <HostPaymentsPage />}

                        {activeTab !== 'Profile' && (
                            activeTab !== 'Team' && activeTab !== 'Payments' && (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-card rounded-[2rem] flex items-center justify-center text-foreground-200">
                                        <Settings size={40} strokeWidth={1} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif font-black text-foreground">{activeTab} Settings</h3>
                                        <p className="text-muted-foreground font-medium max-w-xs mx-auto mt-2">
                                            We're currently building out the {activeTab.toLowerCase()} management interface. Check back soon!
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostSettingsPage;
