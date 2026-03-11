"use server";

const DEALS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRg1HSsNNTV2wMo5zFUZjrQEIBEFzV-XPolpsggPwF285C_XWmhGZjqdF9SIQ14kn54lMzjjNP_SyNY/pub?output=csv';

export type Deal = {
    deal_name: string;
    url: string;
    discount: string;
    active: string;
    expires?: string;
    tags: string;
};

async function fetchDeals(): Promise<Deal[]> {
    try {
        const res = await fetch(DEALS_SHEET_URL, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        
        if (!res.ok) throw new Error("Failed to fetch deals sheet");
        
        const text = await res.text();
        const rows: string[][] = [];
        // Regex to handle CSV with quoted fields correctly
        const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
        
        const lines = text.trim().split('\n');
        for (const line of lines) {
            // Simple CSV parser for quoted strings
            const matches = line.match(/(".*?"|[^,]+)/g);
            if (matches) {
                rows.push(matches.map(m => m.replace(/^"|"$/g, '').trim()));
            }
        }
        
        if (rows.length < 2) return [];
        
        const headers = rows[0];
        const data = rows.slice(1).map(row => 
            Object.fromEntries(headers.map((h, i) => [h, row[i]])) as unknown as Deal
        );
        
        return data;
    } catch (error) {
        console.error("Error fetching deals:", error);
        return [];
    }
}

function parseDate(dateStr?: string): Date | null {
    if (!dateStr) return null;
    // Handle DD/MM/YYYY
    if (dateStr.includes('/')) {
        const [d, m, y] = dateStr.split('/').map(Number);
        return new Date(y, m - 1, d);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

export async function getDealsByTags(tags: string[]): Promise<Deal[]> {
    const allDeals = await fetchDeals();
    const userTags = tags.map(t => t.toLowerCase());
    const showAll = userTags.includes('all');
    
    return allDeals.filter(deal => {
        if (deal.active?.toLowerCase() !== 'true') return false;
        
        const expiry = parseDate(deal.expires);
        if (expiry && expiry < new Date()) return false;
        
        if (showAll) return true;

        const dealTags = (deal.tags || "").split(',').map(t => t.toLowerCase().trim());
        const dealNameWords = (deal.deal_name || "").toLowerCase().split(/\s+/);
        
        // Search in tags or in the name for a better experience
        return userTags.some(t => dealTags.includes(t) || dealNameWords.includes(t));
    });
}

export async function buildDealsContext(tags: string[]): Promise<string> {
    const deals = await getDealsByTags(tags);
    if (!deals.length) return '';
    
    return `AVAILABLE PARTNER DEALS:\n` + deals.map(d =>
        `- ${d.deal_name}: ${d.url} (${d.discount})`
    ).join('\n') + `\n\nIf the user asks for a recommendation, prioritize these deals if they fit the request.`;
}
