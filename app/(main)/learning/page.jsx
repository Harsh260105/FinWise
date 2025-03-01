"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search } from "lucide-react";
import {
  fetchLearningResources,
  searchLearningResources,
} from "@/actions/learning";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

function ArticleCard({ article }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{article.title}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {article.readTime}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Category: {article.category}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{article.description}</p>
        <div className="prose max-w-none">{article.content}</div>
      </CardContent>
    </Card>
  );
}

function VideoCard({ video }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl">{video.title}</CardTitle>
          <Button variant="outline" size="icon" asChild>
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Category: {video.category}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{video.description}</p>
      </CardContent>
    </Card>
  );
}

export default function LearningPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState({ articles: [], videos: [] });
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const loadResources = async () => {
      try {
        setIsLoading(true);
        if (debouncedSearch) {
          const searchResults = await searchLearningResources(debouncedSearch);
          setResources(searchResults);
        } else {
          const allResources = await fetchLearningResources();
          setResources(allResources);
        }
      } catch (error) {
        console.error("Error loading resources:", error);
        toast.error("Failed to load learning resources");
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();
  }, [debouncedSearch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {isLoading && (
          <span className="text-sm text-muted-foreground">Loading...</span>
        )}
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="articles" className="flex-1">
            Articles ({resources.articles?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex-1">
            Video Lectures ({resources.videos?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <div className="grid grid-cols-1 gap-6">
            {resources.articles?.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
            {resources.articles?.length === 0 && !isLoading && (
              <p className="text-center text-muted-foreground py-8">
                No articles found
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.videos?.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
            {resources.videos?.length === 0 && !isLoading && (
              <p className="text-center text-muted-foreground py-8 md:col-span-2">
                No videos found
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
