'use server';

// We'll use the Mutual Funds India API (example URL - you'll need to replace with actual API)
const API_BASE_URL = '';

const FUND_CATEGORIES = [
    'Equity',
    'Debt',
    'Hybrid',
    'Index',
    'Sectoral',
    'International'
];

export async function getFundCategories() {
    return FUND_CATEGORIES;
}

export async function fetchMutualFunds(category = 'all') {
    try {
        const response = await fetch(`${API_BASE_URL}/mf/search`);
        if (!response.ok) {
            throw new Error('Failed to fetch mutual funds');
        }
        const data = await response.json();

        // Filter by category if specified
        if (category !== 'all') {
            return data.filter(fund => fund.scheme_category.toLowerCase().includes(category.toLowerCase()));
        }

        return data;
    } catch (error) {
        console.error('Error fetching mutual funds:', error);
        throw new Error('Failed to fetch mutual funds');
    }
}

export async function searchMutualFunds(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/mf/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Failed to search mutual funds');
        }
        return await response.json();
    } catch (error) {
        console.error('Error searching mutual funds:', error);
        throw new Error('Failed to search mutual funds');
    }
}

export async function getMutualFundDetails(schemeCode) {
    try {
        const response = await fetch(`${API_BASE_URL}/mf/${schemeCode}`);
        if (!response.ok) {
            throw new Error('Failed to fetch fund details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching fund details:', error);
        throw new Error('Failed to fetch fund details');
    }
} 