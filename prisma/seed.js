const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Delete existing records
    await prisma.learningResource.deleteMany();

    // Create sample articles
    const articles = [
        {
            title: "Understanding Financial Markets",
            description: "A comprehensive guide to financial markets and their operations",
            type: "ARTICLE",
            category: "Finance Basics",
            content: `
        Financial markets play a crucial role in the global economy. They facilitate the buying and selling of financial instruments and enable the flow of capital between investors and businesses.

        Key Components of Financial Markets:
        1. Stock Markets
        2. Bond Markets
        3. Forex Markets
        4. Commodity Markets

        Understanding these markets is essential for making informed investment decisions...
      `,
            readTime: "10 min"
        },
        {
            title: "Investment Strategies for Beginners",
            description: "Learn the fundamentals of investment and portfolio management",
            type: "ARTICLE",
            category: "Investment",
            content: `
        Starting your investment journey can be overwhelming. This guide will help you understand the basics and develop a solid investment strategy.

        Key Topics:
        1. Asset Allocation
        2. Risk Management
        3. Diversification
        4. Long-term Planning

        Let's explore each of these topics in detail...
      `,
            readTime: "15 min"
        }
    ];

    // Create sample videos
    const videos = [
        {
            title: "Introduction to Stock Trading",
            description: "Learn the basics of stock trading and market analysis",
            type: "VIDEO",
            category: "Trading",
            youtubeUrl: "https://www.youtube.com/watch?v=example1"
        },
        {
            title: "Technical Analysis Fundamentals",
            description: "Understanding charts and technical indicators",
            type: "VIDEO",
            category: "Trading",
            youtubeUrl: "https://www.youtube.com/watch?v=example2"
        }
    ];

    // Insert all resources
    await prisma.learningResource.createMany({
        data: [...articles, ...videos]
    });

    console.log('Seed data created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 