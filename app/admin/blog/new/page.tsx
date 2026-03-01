"use client";

import BlogForm from "@/components/admin/BlogForm";
import { createBlogPost } from "@/lib/firestore-service";
import { BlogPost } from "@/lib/types";

export default function NewBlogPostPage() {
    const handleSubmit = async (data: Omit<BlogPost, 'id'>) => {
        await createBlogPost(data);
    };

    return <BlogForm onSubmit={handleSubmit} title="Create New Blog Post" />;
}
