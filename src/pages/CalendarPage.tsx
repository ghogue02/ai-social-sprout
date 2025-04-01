
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
          <p className="text-gray-400 mt-1">Schedule and plan your content</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-allendale-gold/20 rounded-lg p-4">
            <h2 className="text-xl font-medium mb-4">Content Schedule</h2>
            <p className="text-gray-400 mb-4">No content scheduled yet. Use the calendar to plan your content.</p>
          </div>
          <div className="bg-allendale-black border border-allendale-gold/20 rounded-lg p-4">
            <h2 className="text-xl font-medium mb-4">Select Date</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border border-allendale-gold/20 rounded-lg"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
