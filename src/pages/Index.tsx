
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentContent from "@/components/dashboard/RecentContent";
import UpcomingContent from "@/components/dashboard/UpcomingContent";
import MarketingInsights from "@/components/dashboard/MarketingInsights";
import { CalendarCheck, ImageIcon, LineChart, MessageSquare, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif gold-gradient">Marketing Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your restaurant's marketing content</p>
          </div>
          <Button 
            onClick={() => navigate("/content")}
            className="bg-allendale-gold text-black hover:bg-allendale-gold/80"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Create Content
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Content Pieces" 
            value="48" 
            subtitle="12 created this month" 
            icon={MessageSquare} 
          />
          <StatsCard 
            title="Images Generated" 
            value="32" 
            subtitle="8 created this month" 
            icon={ImageIcon} 
          />
          <StatsCard 
            title="Scheduled Posts" 
            value="16" 
            subtitle="For the next 30 days" 
            icon={CalendarCheck} 
          />
          <StatsCard 
            title="Engagement Rate" 
            value="4.8%" 
            subtitle="↑ 0.6% from last month" 
            icon={LineChart} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentContent />
        </div>
        <div>
          <UpcomingContent />
        </div>
      </div>

      <div className="mt-6">
        <MarketingInsights />
      </div>
    </MainLayout>
  );
};

export default Index;
