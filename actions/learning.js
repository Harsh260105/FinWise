'use server';

import { db } from "@/lib/prisma";

export async function fetchLearningResources(type = 'all') {
    try {
        const resources = await db.learningResource.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: type !== 'all' ? {
                type: type === 'articles' ? 'ARTICLE' : 'VIDEO'
            } : undefined
        });

        // Transform the data to match the expected format
        const articles = resources
            .filter(r => r.type === 'ARTICLE')
            .map(article => ({
                id: article.id,
                title: article.title,
                description: article.description,
                category: article.category,
                content: article.content,
                readTime: article.readTime,
                createdAt: article.createdAt
            }));

        const videos = resources
            .filter(r => r.type === 'VIDEO')
            .map(video => ({
                id: video.id,
                title: video.title,
                description: video.description,
                youtubeUrl: video.youtubeUrl,
                category: video.category,
                createdAt: video.createdAt
            }));

        if (type === 'articles') return articles;
        if (type === 'videos') return videos;
        return { articles, videos };

    } catch (error) {
        console.error('Error fetching learning resources:', error);
        throw new Error('Failed to fetch learning resources');
    }
}

export async function searchLearningResources(query) {
    if (!query) return fetchLearningResources();

    try {
        const resources = await db.learningResource.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const articles = resources
            .filter(r => r.type === 'ARTICLE')
            .map(article => ({
                id: article.id,
                title: article.title,
                description: article.description,
                category: article.category,
                content: article.content,
                readTime: article.readTime,
                createdAt: article.createdAt
            }));

        const videos = resources
            .filter(r => r.type === 'VIDEO')
            .map(video => ({
                id: video.id,
                title: video.title,
                description: video.description,
                youtubeUrl: video.youtubeUrl,
                category: video.category,
                createdAt: video.createdAt
            }));

        return { articles, videos };

    } catch (error) {
        console.error('Error searching learning resources:', error);
        throw new Error('Failed to search learning resources');
    }
} 