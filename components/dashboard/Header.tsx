"use client";

import React from 'react';
import { Bell, Menu, HelpCircle } from 'lucide-react';
import { getBlogPosts, getFaqs } from '@/lib/firestore-service';
import { FAQ, FAQCategory, BlogPost } from '@/lib/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SupportChat from './SupportChat';

const FAQ_CATEGORIES: FAQCategory[] = [
  { id: 'general', label: 'General' },
  { id: 'hosts', label: 'For Hosts' },
  { id: 'vendors', label: 'For Vendors' },
  { id: 'payments', label: 'Payments & Security' },
];

type NotificationTab = 'all' | 'updates' | 'messages';

interface MessageNotification {
  id: string;
  title: string;
  body: string;
  date: string;
}

const MESSAGE_NOTIFICATIONS: MessageNotification[] = [
  {
    id: 'msg-1',
    title: 'Support team',
    body: 'Need help with your event flow? We can assist with setup and vendor coordination.',
    date: 'March 1, 2026',
  },
  {
    id: 'msg-2',
    title: 'Waddi success',
    body: 'Your workspace is ready. Add event details to get itinerary and vendor suggestions.',
    date: 'February 28, 2026',
  },
];

interface HeaderProps {
  onOpenMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenMenu }) => {
  const [faqs, setFaqs] = React.useState<FAQ[]>([]);
  const [updatePosts, setUpdatePosts] = React.useState<BlogPost[]>([]);
  const [loadingUpdates, setLoadingUpdates] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<NotificationTab>('all');

  React.useEffect(() => {
    async function loadHeaderData() {
      try {
        const [faqData, blogPosts] = await Promise.all([getFaqs(), getBlogPosts()]);
        setFaqs(faqData);
        const filteredUpdates = blogPosts.filter((post) =>
          post.category?.toLowerCase().includes('update')
        );
        setUpdatePosts(filteredUpdates);
      } catch (error) {
        console.error('Failed to load header data:', error);
      } finally {
        setLoadingUpdates(false);
      }
    }

    loadHeaderData();
  }, []);

  const renderUpdateSections = (posts: BlogPost[]) => (
    <div className="mx-auto w-full max-w-[900px] space-y-6">
      {posts.map((post) => (
        <section
          key={post.id}
          className="grid grid-cols-1 gap-6 lg:grid-cols-[160px_minmax(0,680px)]"
        >
          <div className="hidden lg:block">
            <div className="sticky top-6 pt-1">
              <p className="text-sm font-bold tracking-tight text-foreground">Updates</p>
              <p className="text-sm text-muted-foreground">{post.date}</p>
            </div>
          </div>

          <div className="rounded-2xl">
            <img
              src={post.image || '/placeholder.png'}
              alt={post.title}
              className="w-full h-[340px] object-cover rounded-2xl"
            />
            <div className="pt-5 px-1 pb-2">
              <p className="text-2xl font-semibold text-foreground leading-tight">{post.title}</p>
              <p className="text-base text-muted-foreground mt-4 leading-relaxed">{post.excerpt}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );

  return (
    <div className="h-full flex items-center justify-between px-6 bg-background">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMenu}
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Support">
                <HelpCircle size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[400px] sm:w-[500px] border-none bg-transparent shadow-none mr-4" align="end" sideOffset={10}>
              <SupportChat faqs={faqs} categories={FAQ_CATEGORIES} className="h-[600px] shadow-2xl border border-border" />
            </PopoverContent>
          </Popover>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {updatePosts.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full border border-background" />
              )}
            </button>
          </DialogTrigger>

          <DialogContent className="w-[96vw] max-w-[1120px] h-[92vh] p-0 gap-0 overflow-hidden bg-[#f6f6f6] border-border">
            <DialogHeader className="sr-only">
              <DialogTitle>Notifications</DialogTitle>
            </DialogHeader>

            <div className="h-full overflow-y-auto">
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as NotificationTab)}
                className="px-6 pt-8 pb-6"
              >
                <div className="pb-5 border-b border-border/60 flex flex-col items-center gap-5 bg-[#f6f6f6]">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Notifications</h2>
                  <TabsList className="h-auto rounded-2xl border border-border bg-[#ececec] p-1">
                    <TabsTrigger value="all" className="px-6 py-2 rounded-xl">All</TabsTrigger>
                    <TabsTrigger value="updates" className="px-6 py-2 rounded-xl">Updates</TabsTrigger>
                    <TabsTrigger value="messages" className="px-6 py-2 rounded-xl">Messages</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="messages" className="mt-6">
                  <div className="mx-auto w-full max-w-[820px] space-y-3">
                    {MESSAGE_NOTIFICATIONS.map((msg) => (
                      <div key={msg.id} className="rounded-2xl border border-border/70 p-5">
                        <p className="text-base font-semibold text-foreground">{msg.title}</p>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{msg.body}</p>
                        <p className="text-xs text-muted-foreground mt-4">{msg.date}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="updates" className="mt-6">
                  {loadingUpdates ? (
                    <div className="py-16 flex items-center justify-center text-muted-foreground">Loading notifications...</div>
                  ) : updatePosts.length === 0 ? (
                    <div className="py-16 flex items-center justify-center text-muted-foreground">No update notifications yet.</div>
                  ) : (
                    renderUpdateSections(updatePosts)
                  )}
                </TabsContent>

                <TabsContent value="all" className="mt-6">
                  {loadingUpdates ? (
                    <div className="py-16 flex items-center justify-center text-muted-foreground">Loading notifications...</div>
                  ) : updatePosts.length === 0 ? (
                    <div className="py-16 flex items-center justify-center text-muted-foreground">No update notifications yet.</div>
                  ) : (
                    renderUpdateSections(updatePosts)
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Header;
