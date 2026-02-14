export interface BlogPost {
    id: string;
    title: string;
    category: string;
    date: string;
    image: string;
    author: string;
    excerpt: string;
    content: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        id: 'budget-tracker',
        title: 'Ultimate Event Budget Tracker Template',
        category: 'Templates',
        date: 'Feb 12, 2026',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
        author: 'Visual Team',
        excerpt: 'Learn how to manage your event finances effectively with our customized tracking system.',
        content: `
      <h2>Why Budgeting Matters</h2>
      <p>Budgeting is the backbone of any successful event. Without a clear financial roadmap, costs can spiral out of control...</p>
      <h3>How to use this template</h3>
      <p>Our template is divided into three main sections: Fixed Costs, Variable Costs, and Contingency...</p>
    `
    },
    {
        id: 'venue-scouting',
        title: 'Top 10 Lagos Venues for 2026',
        category: 'Guides',
        date: 'Feb 10, 2026',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
        author: 'Amina J.',
        excerpt: 'We scouted the most premium locations in Lekki and Victoria Island so you don\'t have to.',
        content: `
      <h2>The Best of Lagos</h2>
      <p>Finding the right venue is about more than just aesthetics. It\'s about logistics, accessibility, and vibe...</p>
    `
    },
    {
        id: 'diy-decor',
        title: 'Minimalist Decor: Less is More',
        category: 'Design',
        date: 'Feb 05, 2026',
        image: 'https://images.unsplash.com/photo-1478146896981-b80c4635432c?auto=format&fit=crop&q=80&w=800',
        author: 'Sarah K.',
        excerpt: 'How to create a high-end feel for your event without breaking the bank on decorations.',
        content: `
      <h2>Simplicity is Elegance</h2>
      <p>Minimalism doesn\'t mean bare—it means intentional. Focus on lighting and texture to create depth...</p>
    `
    },
    {
        id: 'catering-questions',
        title: '15 Questions to Ask Your Caterer',
        category: 'Food',
        date: 'Jan 28, 2026',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800',
        author: 'Bode T.',
        excerpt: 'Avoid last-minute surprises by asking these critical questions before signing any catering contract.',
        content: `
      <h2>The Menu is Just the Beginning</h2>
      <p>Are staff costs included? What about the cleanup fee? These are the details that matter...</p>
    `
    }
];
