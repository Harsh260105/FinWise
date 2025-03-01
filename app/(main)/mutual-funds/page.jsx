"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, TrendingUp, ArrowUpRight, Info } from "lucide-react";
import {
  fetchMutualFunds,
  searchMutualFunds,
  getMutualFundDetails,
  getFundCategories,
} from "@/actions/mutual-funds";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

function MutualFundCard({ fund }) {
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(null);

  const loadDetails = async () => {
    try {
      const data = await getMutualFundDetails(fund.schemeCode);
      setDetails(data);
    } catch (error) {
      toast.error("Failed to load fund details");
    }
  };

  useEffect(() => {
    if (showDetails && !details) {
      loadDetails();
    }
  }, [showDetails]);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl">{fund.schemeName}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">{fund.fundHouse}</div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Category</span>
            <span className="font-medium">{fund.schemeCategory}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">NAV</span>
            <span className="font-medium">₹{fund.nav}</span>
          </div>
          {fund.returns && (
            <div className="flex justify-between items-center">
              <span className="text-sm">1Y Returns</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-600">
                  {fund.returns}%
                </span>
              </div>
            </div>
          )}
          {showDetails && details && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Min Investment</span>
                <span>₹{details.minInvestment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Expense Ratio</span>
                <span>{details.expenseRatio}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fund Size</span>
                <span>₹{details.aum} Cr</span>
              </div>
              <Button className="w-full mt-4" asChild>
                <a
                  href={details.investmentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Invest Now <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MutualFundsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [funds, setFunds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fundCategories = await getFundCategories();
        setCategories(fundCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Failed to load fund categories");
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadFunds = async () => {
      try {
        setIsLoading(true);
        if (debouncedSearch) {
          const searchResults = await searchMutualFunds(debouncedSearch);
          setFunds(searchResults);
        } else {
          const allFunds = await fetchMutualFunds(selectedCategory);
          setFunds(allFunds);
        }
      } catch (error) {
        console.error("Error loading funds:", error);
        toast.error("Failed to load mutual funds");
      } finally {
        setIsLoading(false);
      }
    };

    loadFunds();
  }, [debouncedSearch, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search mutual funds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="text-muted-foreground">Loading mutual funds...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {funds.map((fund) => (
            <MutualFundCard key={fund.schemeCode} fund={fund} />
          ))}
          {funds.length === 0 && (
            <p className="text-center text-muted-foreground py-8 md:col-span-2">
              No mutual funds found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
