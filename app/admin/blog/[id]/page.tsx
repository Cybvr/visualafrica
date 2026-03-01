"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { getBlogPostById, updateBlogPost } from "@/lib/firestore-service";
import { BlogPost } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditBlogPostPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPost() {
            setLoading(true);
            try {
                const data = await getBlogPostById(id);
                if (data) {
                    setPost(data);
                } else {
                    toast.error("Blog post not found");
                    router.push("/admin/blog");
                }
            } catch (error) {
                console.error("Failed to load blog post:", error);
                toast.error("Failed to load blog post");
            } finally {
                setLoading(false);
            }
        }
        loadPost();
    }, [id, router]);

    const handleSubmit = async (data: Omit<BlogPost, 'id'>) => {
        await updateBlogPost(id, data);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 size={40} className="animate-spin text-primary" />
            </div>
        );
    }

    if (!post) return null;

    return <BlogForm initialData={post} onSubmit={handleSubmit} title="Edit Blog Post" />;
}
