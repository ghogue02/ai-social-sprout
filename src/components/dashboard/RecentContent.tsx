
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ThumbsUp, Calendar } from "lucide-react";

const RecentContent = () => {
  const recentPosts = [
    {
      title: "Weekend Special: Half-price cocktails",
      platform: "Instagram",
      engagement: "124 likes",
      date: "2 days ago",
      image: "/lovable-uploads/114459a1-d024-4baa-a7d7-b79af7498faf.png"
    },
    {
      title: "Chef's Special Seasonal Menu",
      platform: "Facebook",
      engagement: "87 likes",
      date: "4 days ago",
      image: "/lovable-uploads/f55e7e77-60cb-4f48-bc68-eb3e9d21e114.png"
    },
    {
      title: "Live Music Friday - The Local Band",
      platform: "Instagram",
      engagement: "203 likes",
      date: "1 week ago",
      image: "/lovable-uploads/e2054355-0b65-49d0-9d6b-dec4eab7ec3f.png"
    }
  ];

  return (
    <Card className="border-allendale-gold/20 bg-allendale-black/50 h-full">
      <CardHeader className="flex items-center justify-between pb-2 border-b border-allendale-gold/20">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-allendale-gold" />
          <CardTitle className="text-sm font-medium text-gray-200">Recent Content</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {recentPosts.map((post, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-14 w-14 rounded overflow-hidden flex-shrink-0">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col flex-grow">
                <h4 className="text-sm font-medium text-gray-200">{post.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{post.platform}</span>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{post.engagement}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentContent;
