import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Users, Plus } from 'lucide-react';
import { getEvents } from '@/lib/firestore-service';
import { Button } from '@/components/ui/button';

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">My Events</h2>
                    <p className="text-muted-foreground mt-1">Manage all your upcoming and past events.</p>
                </div>
                <Link href="/dashboard/hosts/events/new">
                    <Button className="rounded-full gap-2 text-primary-foreground">
                        <Plus size={18} />
                        Create Event
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {events.map((event) => (
                    <Link
                        key={event.id}
                        href={`/dashboard/hosts/events/${event.id}`}
                        className="group bg-card border border-border rounded-3xl p-4 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer"
                    >
                        {/* Event Image */}
                        <div className="relative w-full md:w-72 h-48 md:h-auto rounded-2xl overflow-hidden shrink-0">
                            <Image
                                src={event.image}
                                alt={event.eventName}
                                fill
                                className="object-cover transition-transform duration-500 "
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                            <div className="absolute bottom-4 left-4 text-white md:hidden">
                                <span className="px-2 py-1 bg-primary text-[10px] font-bold uppercase tracking-widest rounded-md">
                                    {event.status}
                                </span>
                            </div>
                        </div>

                        {/* Event Info */}
                        <div className="flex-1 py-2 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="hidden md:inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                                        {event.status}
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">ID: #{event.id}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {event.eventName}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-2 max-w-2xl">
                                    {event.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                    <Calendar size={16} className="text-primary" />
                                    <span className="font-semibold">{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                    <MapPin size={16} className="text-primary" />
                                    <span className="font-semibold">{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                    <Users size={16} className="text-primary" />
                                    <span className="font-semibold">{event.guestCount} Guests</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
