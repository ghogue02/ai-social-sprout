
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

const MarketingInsights = () => {
  const insights = [
    "Instagram engagement has increased by 12% over the last month",
    "Food-related content is performing 25% better than drinks content",
    "Best time to post is between 5-7pm on weekdays",
    "User-generated content receives 30% more engagement",
    "Special events promotions have the highest conversion rate"
  ];

  return (
    <Card className="border-allendale-gold/20 bg-allendale-black/50 h-full">
      <CardHeader className="flex items-center justify-between pb-2 border-b border-allendale-gold/20">
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-allendale-gold" />
          <CardTitle className="text-sm font-medium text-gray-200">Marketing Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-3">
          {insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-allendale-gold flex-shrink-0 mt-0.5">•</span>
              <span className="text-gray-300">{insight}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default MarketingInsights;
