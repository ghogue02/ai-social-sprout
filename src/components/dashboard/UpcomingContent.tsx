
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const UpcomingContent = () => {
  const upcomingPosts = [
    {
      title: "New Cocktail Menu Launch",
      date: "Tomorrow, 3:00 PM",
      platform: "Instagram, Facebook"
    },
    {
      title: "Weekend Brunch Special",
      date: "Fri, Sep 29",
      platform: "Instagram"
    },
    {
      title: "October Events Calendar",
      date: "Mon, Oct 1",
      platform: "All platforms"
    }
  ];

  return (
    <Card className="border-allendale-gold/20 bg-allendale-black/50 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-allendale-gold/20">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-allendale-gold" />
          <CardTitle className="text-sm font-medium text-gray-200">Upcoming Content</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="text-allendale-gold h-8 px-2">
          <Calendar className="h-4 w-4 mr-1" />
          View Calendar
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {upcomingPosts.map((post, i) => (
            <div key={i} className="flex flex-col">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-200">{post.title}</h4>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-allendale-gold">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-400">{post.date}</span>
                <span className="text-xs text-allendale-gold">{post.platform}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingContent;
