"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogPosts, deleteBlogPost } from "@/lib/firestore-service";
import { BlogPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search, ExternalLink, Loader2, Calendar, User, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await getBlogPosts();
            setPosts(data);
        } catch (error) {
            console.error("Failed to load blog posts:", error);
            toast.error("Failed to load blog posts");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await deleteBlogPost(id);
                setPosts(posts.filter(p => p.id !== id));
                toast.success("Blog post deleted successfully");
            } catch (error) {
                console.error("Failed to delete blog post:", error);
                toast.error("Failed to delete blog post");
            }
        }
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto bg-background text-foreground min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin: Blog Posts</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your blog content • {posts.length} total
                    </p>
                </div>
                <div className="flex flex-col gap-4 items-end">
                    <AdminNav />
                    <Button asChild className="bg-primary text-primary-foreground font-bold">
                        <Link href="/admin/blog/new" className="flex items-center gap-2">
                            <Plus size={18} /> Add New Post
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                    type="text"
                    placeholder="Search posts by title, category, or author..."
                    className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div key={post.id} className="bg-card border border-border rounded-2xl overflow-hidden p-4 flex items-center gap-6 group hover:border-primary/50 transition-all hover:shadow-lg">
                                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-border">
                                    <img
                                        src={post.image || '/placeholder.png'}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-secondary/50 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {post.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                                            <Calendar size={12} />
                                            {post.date}
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-black text-foreground line-clamp-1">
                                        {post.title}
                                    </h2>

                                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} />
                                            {post.author}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pr-2">
                                    <Button variant="ghost" size="icon" asChild title="View Public Post" className="hover:bg-secondary">
                                        <Link href={`/blog/${post.id}`} target="_blank">
                                            <ExternalLink size={18} />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" asChild className="text-blue-500 hover:text-blue-600 hover:bg-blue-50" title="Edit Post">
                                        <Link href={`/admin/blog/${post.id}`}>
                                            <Edit size={18} />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(post.id, post.title)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        title="Delete Post"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl">
                            <h3 className="text-xl font-bold text-foreground mb-1">No posts found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or create a new post.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
