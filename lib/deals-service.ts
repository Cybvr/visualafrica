"use server";

const DEAL_SOURCES = {
    travel: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRg1HSsNNTV2wMo5zFUZjrQEIBEFzV-XPolpsggPwF285C_XWmhGZjqdF9SIQ14kn54lMzjjNP_SyNY/pub?gid=0&single=true&output=csv",
    cars: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRg1HSsNNTV2wMo5zFUZjrQEIBEFzV-XPolpsggPwF285C_XWmhGZjqdF9SIQ14kn54lMzjjNP_SyNY/pub?gid=390198319&single=true&output=csv"
};

export type Deal = {
    deal_name: string;
    url: string;
    discount: string;
    active: string;
    expires?: string;
    tags: string;
    source?: string;
};

async function fetchDealsFromUrl(url: string, sourceKey: string): Promise<Deal[]> {
    try {
        const res = await fetch(url, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        
        if (!res.ok) throw new Error(`Failed to fetch deals from ${sourceKey}`);
        
        const text = await res.text();
        const rows: string[][] = [];
        
        const lines = text.trim().split('\n');
        for (const line of lines) {
            const matches = line.match(/(".*?"|[^,]+)/g);
            if (matches) {
                rows.push(matches.map(m => m.replace(/^"|"$/g, '').trim()));
            }
        }
        
        if (rows.length < 2) return [];
        
        const headers = rows[0];
        return rows.slice(1).map(row => {
            const raw = Object.fromEntries(headers.map((h, i) => [h, row[i]]));
            
            // Map Car Rental headers to Deal type
            if (sourceKey === 'cars') {
                return {
                    deal_name: `${raw['Agency'] || ''}: ${raw['Car Type'] || ''}`.trim(),
                    url: raw['URL'] || '',
                    discount: raw['Daily Rate (NGN)'] || raw['Good Deal Price (USD)'] || 'N/A',
                    active: 'true', // Car sheet has no active col, assume true
                    tags: `cars, rentals, ${raw['Rental Locations'] || ''}`,
                    source: sourceKey
                };
            }
            
            // Default (Travel) mapping
            return {
                deal_name: raw['deal_name'] || '',
                url: raw['url'] || '',
                discount: raw['discount'] || '',
                active: raw['active'] || 'false',
                expires: raw['expires'],
                tags: raw['tags'] || '',
                source: sourceKey
            };
        });
    } catch (error) {
        console.error(`Error fetching deals from ${sourceKey}:`, error);
        return [];
    }
}

async function fetchAllDeals(): Promise<Deal[]> {
    const results = await Promise.all(
        Object.entries(DEAL_SOURCES).map(([key, url]) => fetchDealsFromUrl(url, key))
    );
    return results.flat();
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
    const allDeals = await fetchAllDeals();
    const userTags = tags.map(t => t.toLowerCase());
    
    // Check if we want all deals, or all deals for a specific category
    const showAll = userTags.includes('all');
    const showCars = userTags.includes('cars') || userTags.includes('rentals');
    const showTravel = userTags.includes('travel') || userTags.includes('holiday');

    return allDeals.filter((deal: Deal) => {
        if (deal.active?.toLowerCase() !== 'true') return false;
        
        const expiry = parseDate(deal.expires);
        if (expiry && expiry < new Date()) return false;
        
        if (showAll) return true;
        
        // If clicking a category banner, show all from that source
        if (showCars && deal.source === 'cars') return true;
        if (showTravel && deal.source === 'travel') return true;

        const dealTags = (deal.tags || "").split(',').map((t: string) => t.toLowerCase().trim());
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
