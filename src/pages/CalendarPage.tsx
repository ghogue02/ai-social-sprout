
import MainLayout from "@/components/layout/MainLayout";
import ContentCalendar from "@/components/calendar/ContentCalendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CalendarPage = () => {
  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="mr-4 text-gray-400 hover:text-white"
        >
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-serif gold-gradient">Content Calendar</h1>
          <p className="text-gray-400 mt-1">Schedule and manage your marketing content</p>
        </div>
      </div>

      <ContentCalendar />
    </MainLayout>
  );
};

export default CalendarPage;
