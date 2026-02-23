import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://visualafrica.ai',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://visualafrica.ai/dashboard',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ]
}
