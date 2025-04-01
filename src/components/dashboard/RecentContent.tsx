
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ThumbsUp, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  engagement: { likes?: number; comments?: number } | null;
  published_at: string;
  image_url: string | null;
}

const RecentContent = () => {
  const [recentPosts, setRecentPosts] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentContent() {
      try {
        const { data, error } = await supabase
          .from('content_items')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(3);
        
        if (error) {
          console.error('Error fetching recent content:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setRecentPosts(data as ContentItem[]);
        } else {
          // If no data in Supabase yet, use placeholder content
          setRecentPosts([
            {
              id: '1',
              title: "Weekend Special: Half-price cocktails",
              platform: "Instagram",
              engagement: { likes: 124 },
              published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              image_url: "/lovable-uploads/114459a1-d024-4baa-a7d7-b79af7498faf.png"
            },
            {
              id: '2',
              title: "Chef's Special Seasonal Menu",
              platform: "Facebook",
              engagement: { likes: 87 },
              published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              image_url: "/lovable-uploads/f55e7e77-60cb-4f48-bc68-eb3e9d21e114.png"
            },
            {
              id: '3',
              title: "Live Music Friday - The Local Band",
              platform: "Instagram",
              engagement: { likes: 203 },
              published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              image_url: "/lovable-uploads/e2054355-0b65-49d0-9d6b-dec4eab7ec3f.png"
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecentContent();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <Card className="border-allendale-gold/20 bg-allendale-black/50 h-full">
      <CardHeader className="flex items-center justify-between pb-2 border-b border-allendale-gold/20">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-allendale-gold" />
          <CardTitle className="text-sm font-medium text-gray-200">Recent Content</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 text-allendale-gold animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex gap-3">
                <div className="h-14 w-14 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={post.image_url || "/placeholder.svg"} 
                    alt={post.title} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <h4 className="text-sm font-medium text-gray-200">{post.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{post.platform}</span>
                    <div className="flex items-center text-xs text-gray-400 gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{post.engagement?.likes || 0}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentContent;
