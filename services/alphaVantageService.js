const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error('Alpha Vantage API key is not configured. Please add NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY to your .env file.');
}

// Mock data for development (remove in production)
const MOCK_FUNDS = [
    {
        symbol: "HDFC_EQ",
        name: "HDFC Equity Fund",
        fundHouse: "HDFC",
        category: "Equity",
        nav: 825.45,
        returns: {
            oneYear: "15.8",
            threeYear: "12.5",
            fiveYear: "10.2"
        },
        expenseRatio: "1.5",
        riskLevel: "High",
        minInvestment: 5000,
        fundSize: "₹24,500 Cr",
        exitLoad: "1%",
    },
    // Add more mock funds as needed
];

export async function fetchIndianMutualFunds() {
    try {
        // For development, return mock data
        if (process.env.NODE_ENV === 'development') {
            return MOCK_FUNDS;
        }

        const response = await fetch(`${BASE_URL}?function=MUTUAL_FUND_SEARCH&keywords=india&apikey=${ALPHA_VANTAGE_API_KEY}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch mutual funds');
        }

        return data.mutualFunds?.map(fund => ({
            symbol: fund.symbol,
            name: fund.name,
            fundHouse: extractFundHouse(fund.name),
            category: determineFundCategory(fund.name),
            nav: fund.nav || 'N/A',
            returns: {
                oneYear: fund.returns?.oneYear || 'N/A',
                threeYear: fund.returns?.threeYear || 'N/A',
                fiveYear: fund.returns?.fiveYear || 'N/A'
            },
            expenseRatio: fund.expenseRatio || '1.5',
            riskLevel: determineRiskLevel(fund.name),
            minInvestment: determineMinInvestment(fund.category),
            fundSize: 'N/A',
            exitLoad: '1%',
            fundManager: 'N/A',
        })) || [];

    } catch (error) {
        console.error('Error fetching mutual funds:', error);
        // Return mock data as fallback in case of error
        return MOCK_FUNDS;
    }
}

// Helper function to extract fund house from fund name
function extractFundHouse(fundName) {
    const commonFundHouses = ['HDFC', 'SBI', 'ICICI', 'Axis', 'Tata', 'Aditya Birla', 'Kotak', 'UTI', 'DSP'];
    const match = commonFundHouses.find(house => fundName.includes(house));
    return match || 'Other';
}

// Helper function to determine fund category based on name
function determineFundCategory(fundName) {
    const nameL = fundName.toLowerCase();
    if (nameL.includes('equity')) return 'Equity';
    if (nameL.includes('debt')) return 'Debt';
    if (nameL.includes('hybrid') || nameL.includes('balanced')) return 'Hybrid';
    if (nameL.includes('index')) return 'Index';
    if (nameL.includes('tax') || nameL.includes('elss')) return 'Tax Saving';
    if (nameL.includes('liquid')) return 'Liquid';
    return 'Other';
}

// Helper function to determine risk level
function determineRiskLevel(fundName) {
    const nameL = fundName.toLowerCase();
    if (nameL.includes('equity') || nameL.includes('small cap') || nameL.includes('mid cap')) return 'High';
    if (nameL.includes('balanced') || nameL.includes('hybrid')) return 'Moderate';
    if (nameL.includes('debt') || nameL.includes('liquid')) return 'Low';
    return 'Moderate';
}

// Helper function to determine minimum investment
function determineMinInvestment(category) {
    switch (category) {
        case 'Equity':
            return 1000;
        case 'Debt':
            return 5000;
        case 'Liquid':
            return 10000;
        default:
            return 5000;
    }
}

export async function fetchMutualFundDetails(symbol) {
    try {
        // For development, return mock details
        if (process.env.NODE_ENV === 'development') {
            const mockFund = MOCK_FUNDS.find(f => f.symbol === symbol) || MOCK_FUNDS[0];
            return {
                ...mockFund,
                investmentObjective: "Long-term capital appreciation through equity investment",
                fundManager: "John Doe",
                fundSize: "₹24,500 Cr",
            };
        }

        const response = await fetch(`${BASE_URL}?function=MUTUAL_FUND_DETAILS&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch fund details');
        }

        return {
            ...data,
            expenseRatio: data.expenseRatio || '1.5%',
            minInvestment: data.minInvestment || '₹5,000',
            exitLoad: data.exitLoad || '1%',
            fundManager: data.fundManager || 'Information not available',
            fundSize: data.fundSize || 'Information not available',
            investmentObjective: data.investmentObjective || 'Information not available'
        };

    } catch (error) {
        console.error('Error fetching fund details:', error);
        // Return mock data as fallback
        const mockFund = MOCK_FUNDS.find(f => f.symbol === symbol) || MOCK_FUNDS[0];
        return {
            ...mockFund,
            investmentObjective: "Long-term capital appreciation through equity investment",
            fundManager: "John Doe",
            fundSize: "₹24,500 Cr",
        };
    }
}

export async function fetchMutualFundNav(symbol) {
    try {
        const response = await fetch(`${BASE_URL}?function=MUTUAL_FUND_NAV&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch NAV data');
        }

        const data = await response.json();
        
        return {
            nav: data.nav || 0,
            lastUpdated: data.lastUpdated || new Date().toISOString()
        };
    } catch (error) {
        console.error('Error fetching NAV:', error);
        throw error;
    }
} 