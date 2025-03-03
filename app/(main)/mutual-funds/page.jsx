"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import InvestRecommend from "./invest-recommend";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MutualFundCard from "./_components/MutualFundCard";
import { fetchIndianMutualFunds } from "@/services/alphaVantageService";

const CATEGORIES = [
  "All",
  "Equity",
  "Debt",
  "Hybrid",
  "Index",
  "Tax Saving",
  "Liquid"
];

const POPULAR_SEARCHES = [
  "HDFC",
  "SBI",
  "Axis",
  "ICICI",
  "Tata"
];

export default function MutualFundsPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [funds, setFunds] = useState([]);
  const [filteredFunds, setFilteredFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadFunds = async () => {
    if (!mounted) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchIndianMutualFunds();
      setFunds(data);
      setFilteredFunds(data);
      if (data.length === 0) {
        toast.info("No mutual funds data available at the moment. Please try again later.");
      }
    } catch (error) {
      console.error("Error loading funds:", error);
      setError("Failed to load mutual funds. Please try again later.");
      toast.error("Failed to load mutual funds");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch mutual funds data
  useEffect(() => {
    loadFunds();
  }, [mounted]);

  // Filter funds based on search and category
  useEffect(() => {
    if (!mounted) return;
    
    let filtered = [...funds];

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(fund => 
        fund.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(fund =>
        fund.name.toLowerCase().includes(searchLower) ||
        fund.fundHouse.toLowerCase().includes(searchLower)
      );
    }

    setFilteredFunds(filtered);
  }, [debouncedSearch, selectedCategory, funds, mounted]);

  const handlePopularSearch = (term) => {
    setSearchQuery(term);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="funds" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="funds">Mutual Funds</TabsTrigger>
          <TabsTrigger value="recommend">Get Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="funds" className="space-y-6">
          <div className="space-y-4">
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
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Popular searches:</span>
              {POPULAR_SEARCHES.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePopularSearch(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 space-y-2">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              <span className="text-muted-foreground block">Loading mutual funds...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={loadFunds}
                className="ml-2"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFunds.map((fund) => (
                <MutualFundCard key={fund.symbol} fund={fund} />
              ))}
              {filteredFunds.length === 0 && (
                <p className="text-center text-muted-foreground py-8 md:col-span-2">
                  No mutual funds found matching your search criteria
                </p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommend">
          <InvestRecommend />
        </TabsContent>
      </Tabs>
    </div>
  );
}