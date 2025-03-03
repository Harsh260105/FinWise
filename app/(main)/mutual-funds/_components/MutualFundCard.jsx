"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { fetchMutualFundDetails } from "@/services/alphaVantageService";
import { toast } from "sonner";

export default function MutualFundCard({ fund }) {
    const [mounted, setMounted] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const loadDetails = async () => {
        if (details || !mounted) return;
        
        setLoading(true);
        try {
            const fundDetails = await fetchMutualFundDetails(fund.symbol);
            setDetails(fundDetails);
        } catch (error) {
            toast.error("Failed to load fund details");
            console.error("Error loading fund details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
        if (!showDetails) loadDetails();
    };

    const getRiskBadgeColor = (risk) => {
        switch (risk?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'moderate': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatReturns = (value) => {
        if (!mounted) return 'N/A';
        if (value === 'N/A') return value;
        const num = parseFloat(value);
        return isNaN(num) ? 'N/A' : `${num.toFixed(2)}%`;
    };

    if (!mounted) {
        return null;
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <CardTitle className="text-lg font-semibold line-clamp-2">
                            {fund.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {fund.fundHouse}
                        </p>
                    </div>
                    <Badge className={getRiskBadgeColor(fund.riskLevel)}>
                        {fund.riskLevel} Risk
                    </Badge>
                </div>
            </CardHeader>
            
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <p className="font-medium">{fund.category}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">NAV</p>
                            <p className="font-medium">₹{typeof fund.nav === 'number' ? fund.nav.toFixed(2) : fund.nav}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Returns</p>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-slate-50 p-2 rounded">
                                <p className="text-xs text-muted-foreground">1Y</p>
                                <p className="font-medium flex items-center gap-1">
                                    {parseFloat(fund.returns.oneYear) > 0 ? (
                                        <TrendingUp className="h-3 w-3 text-green-500" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-red-500" />
                                    )}
                                    {formatReturns(fund.returns.oneYear)}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-2 rounded">
                                <p className="text-xs text-muted-foreground">3Y</p>
                                <p className="font-medium">{formatReturns(fund.returns.threeYear)}</p>
                            </div>
                            <div className="bg-slate-50 p-2 rounded">
                                <p className="text-xs text-muted-foreground">5Y</p>
                                <p className="font-medium">{formatReturns(fund.returns.fiveYear)}</p>
                            </div>
                        </div>
                    </div>

                    {showDetails && (
                        <div className="space-y-3 pt-3 border-t">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Min Investment</p>
                                    <p className="font-medium">₹{fund.minInvestment}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Expense Ratio</p>
                                    <p className="font-medium">{fund.expenseRatio}%</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Exit Load</p>
                                    <p className="font-medium">{fund.exitLoad}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Fund Size</p>
                                    <p className="font-medium">{fund.fundSize}</p>
                                </div>
                            </div>

                            <Button className="w-full" variant="outline">
                                Invest Now
                            </Button>
                        </div>
                    )}

                    <Button 
                        variant="ghost" 
                        className="w-full text-sm"
                        onClick={handleShowDetails}
                        disabled={loading}
                    >
                        {loading ? (
                            "Loading details..."
                        ) : (
                            <>
                                <Info className="h-4 w-4 mr-2" />
                                {showDetails ? "Show Less" : "Show More Details"}
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}