import React from 'react';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Share2, Bookmark, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getBlogPostById } from '@/lib/firestore-service';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
    const { id } = await params;
    const post = await getBlogPostById(id);

    if (!post) {
        return (
            <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
                <h1 className="text-4xl font-black text-foreground">Story Not Found</h1>
                <p className="text-muted-foreground font-medium">The blog post you're looking for doesn't exist.</p>
                <Link href="/dashboard/hosts/diy-content" className="inline-flex items-center gap-2 text-accent font-bold">
                    <ArrowLeft size={16} /> Back to DIY Resources
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <Link href="/dashboard/hosts/diy-content" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-10">
                <ArrowLeft size={16} />
                Back to Resources
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <article className="lg:col-span-8 space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-xl">
                                {post.category}
                            </span>
                            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                                <Clock size={14} />
                                {post.date}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-between py-6 border-y border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-background text-white flex items-center justify-center font-black text-xs">
                                    {post.author[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-foreground">{post.author}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider italic">Expert</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="p-3 bg-secondary rounded-xl text-muted-foreground hover:text-accent transition-all">
                                    <Share2 size={18} />
                                </button>
                                <button className="p-3 bg-secondary rounded-xl text-muted-foreground hover:text-accent transition-all">
                                    <Bookmark size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>

                    <div
                        className="prose prose-slate prose-lg max-w-none 
                        prose-headings:text-foreground prose-headings:font-black
                        prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:font-medium
                        prose-strong:text-foreground prose-strong:font-black"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="bg-background rounded-lg p-8 text-white space-y-6 sticky top-24">
                        <h3 className="text-xl font-black italic">Start Planning Your Event</h3>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                            Take the insights from this guide and apply them to your next big success.
                        </p>
                        <Link
                            href="/dashboard/hosts/events"
                            className="flex items-center justify-between w-full bg-primary hover:bg-accent0 text-white py-4 px-6 rounded-2xl font-black transition-all group shadow-xl shadow-primary/20"
                        >
                            Create New Event
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}
