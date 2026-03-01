import React from 'react';
import { Header } from "@/app/(marketing)/common/header";
import { Footer } from "@/app/(marketing)/common/footer";
import { getBlogPosts } from "@/lib/firestore-service";
import BlogPostCard from "@/components/dashboard/BlogPostCard";

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-background">
                {/* Hero Section */}
                <div className="bg-secondary/30 border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 py-20 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
                            The <span className="text-primary italic">Waddi</span> Journal
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-muted-foreground font-medium">
                            Expert insights, planning guides, and stories from Lagos's most extraordinary events.
                        </p>
                    </div>
                </div>

                {/* Blog Posts Grid */}
                <div className="max-w-7xl mx-auto px-4 py-16 lg:px-8">
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <BlogPostCard
                                    key={post.id}
                                    post={post}
                                    basePath="/blog"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">No stories yet.</h2>
                            <p className="text-muted-foreground font-medium">Check back soon for fresh insights from our experts.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
