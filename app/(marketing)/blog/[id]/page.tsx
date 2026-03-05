import React from 'react';
import { ArrowLeft, Clock, Share2, Bookmark, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getBlogPostById } from '@/lib/firestore-service';
import { Header } from "@/app/(marketing)/common/header";
import { Footer } from "@/app/(marketing)/common/footer";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
    const { id } = await params;
    const post = await getBlogPostById(id);

    if (!post) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
                        <h1 className="text-4xl font-black text-foreground">Post Not Found</h1>
                        <p className="text-muted-foreground font-medium">The blog post you're looking for doesn't exist.</p>
                        <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-background">
                <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-10">
                        <ArrowLeft size={16} />
                        Back to Resources
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <article className="lg:col-span-8 space-y-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl">
                                        {post.category}
                                    </span>
                                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                                        <Clock size={14} />
                                        {post.date}
                                    </div>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                                    {post.title}
                                </h1>

                                <div className="flex items-center justify-between py-6 border-y border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary text-foreground flex items-center justify-center font-black text-xs">
                                            {post.author[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">{post.author}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider italic">Visual Expert</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button className="p-3 bg-secondary/50 rounded-xl text-primary hover:bg-primary hover:text-foreground transition-all">
                                            <Share2 size={18} />
                                        </button>
                                        <button className="p-3 bg-secondary/50 rounded-xl text-primary hover:bg-primary hover:text-foreground transition-all">
                                            <Bookmark size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="aspect-[21/9] rounded-lg overflow-hidden shadow-2xl relative">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                            </div>

                            <div
                                className="prose prose-slate prose-lg max-w-none 
                                prose-headings:text-foreground prose-headings:font-serif prose-headings:font-bold
                                prose-p:text-muted-foreground prose-p:leading-relaxed
                                prose-strong:text-foreground prose-strong:font-bold"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-8">
                            <div className="bg-foreground text-background rounded-lg p-8 space-y-6 sticky top-24">
                                <h3 className="text-2xl font-serif font-bold italic">Start Planning Your Event</h3>
                                <p className="text-background/70 text-sm font-medium leading-relaxed">
                                    Take the insights from this guide and apply them to your next big success in Lagos.
                                </p>
                                <Link
                                    href="/explore/vendors"
                                    className="flex items-center justify-between w-full bg-primary hover:bg-primary/90 text-foreground py-4 px-6 rounded-2xl font-black transition-all group shadow-xl"
                                >
                                    Explore Vendors
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
