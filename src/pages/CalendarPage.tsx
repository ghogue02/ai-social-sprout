
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import * as CalendarComponents from "@/components/calendar/ContentCalendar";

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
          <p className="text-gray-400 mt-1">Schedule and plan your content</p>
        </div>
      </div>

      <div className="mt-6">
        <CalendarComponents.ContentCalendar />
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
