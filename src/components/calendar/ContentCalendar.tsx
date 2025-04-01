
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Loader } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  date: Date;
  title: string;
  type: string;
  platform: string;
  status: "draft" | "scheduled" | "published";
}

const ContentCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      date: new Date(2023, 8, 10),
      title: "Weekend Cocktail Special",
      type: "promotion",
      platform: "Instagram",
      status: "published"
    },
    {
      id: "2",
      date: new Date(2023, 8, 15),
      title: "New Fall Menu Launch",
      type: "announcement",
      platform: "All platforms",
      status: "scheduled"
    },
    {
      id: "3",
      date: new Date(2023, 8, 22),
      title: "Wine Tasting Event",
      type: "event",
      platform: "Facebook, Instagram",
      status: "draft"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const nextMonth = () => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + 1);
    setDate(next);
  };

  const prevMonth = () => {
    const prev = new Date(date);
    prev.setMonth(prev.getMonth() - 1);
    setDate(prev);
  };

  const handleGenerateMonthContent = () => {
    setLoading(true);
    
    // Simulate generating content
    setTimeout(() => {
      const newEvents: Event[] = [
        ...events,
        {
          id: "4",
          date: new Date(2023, 8, 27),
          title: "Sunday Brunch Promotion",
          type: "promotion",
          platform: "Instagram, Email",
          status: "draft"
        },
        {
          id: "5",
          date: new Date(2023, 9, 5),
          title: "Chef's Tasting Menu Experience",
          type: "promotion",
          platform: "All platforms",
          status: "draft"
        },
        {
          id: "6",
          date: new Date(2023, 9, 12),
          title: "Live Jazz Night Announcement",
          type: "event",
          platform: "Instagram, Facebook",
          status: "draft"
        },
        {
          id: "7",
          date: new Date(2023, 9, 19),
          title: "Seasonal Cocktails Feature",
          type: "promotion",
          platform: "Instagram",
          status: "draft"
        }
      ];
      
      setEvents(newEvents);
      setLoading(false);
      
      toast({
        title: "Content calendar generated!",
        description: "AI has created a content schedule for the next month.",
      });
    }, 2000);
  };

  const getEventsForDate = (day: Date): Event[] => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getFullYear() === day.getFullYear()
    );
  };

  const getDayClass = (day: Date) => {
    const hasEvents = getEventsForDate(day).length > 0;
    return hasEvents ? "bg-allendale-gold/20 text-allendale-gold font-medium" : "";
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Card className="border-allendale-gold/20 bg-allendale-black/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-allendale-gold/20">
        <CardTitle className="text-lg text-allendale-gold font-serif">Content Calendar</CardTitle>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8 border-allendale-gold/30 text-allendale-gold"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {monthNames[date.getMonth()]} {date.getFullYear()}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 border-allendale-gold/30 text-allendale-gold"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-1 p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border-0"
            modifiers={{
              booked: (date) => getEventsForDate(date).length > 0,
            }}
            modifiersStyles={{
              booked: { 
                fontWeight: "bold",
                backgroundColor: "rgba(195, 163, 67, 0.2)", 
                color: "#C3A343"
              }
            }}
            styles={{
              head_cell: {
                width: "100%",
                textTransform: "capitalize",
                color: "#8E9196",
                fontWeight: 500,
                fontSize: "0.875rem",
              },
              cell: {
                width: "100%",
                height: "auto",
                padding: "0.5rem",
              },
              day: {
                width: "100%",
                height: "2.5rem",
                fontSize: "0.875rem",
                margin: 0,
              },
              day_today: {
                backgroundColor: "rgba(195, 163, 67, 0.1)",
                color: "#C3A343",
                border: "1px solid rgba(195, 163, 67, 0.5)",
              },
              day_selected: {
                backgroundColor: "#C3A343 !important",
                color: "#1A1F2C !important",
                fontWeight: "bold",
              },
            }}
          />
        </div>

        <div className="p-4 border-t border-allendale-gold/20">
          <h3 className="font-medium text-allendale-gold mb-3">
            {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          
          <div className="space-y-3">
            {getEventsForDate(date).length > 0 ? (
              getEventsForDate(date).map((event) => (
                <div 
                  key={event.id} 
                  className="p-3 bg-allendale-black border border-allendale-gold/30 rounded-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-white">{event.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{event.platform}</p>
                    </div>
                    <span 
                      className={`text-xs px-2 py-1 rounded-full ${
                        event.status === 'published' ? 'bg-green-900/20 text-green-500' : 
                        event.status === 'scheduled' ? 'bg-blue-900/20 text-blue-500' : 
                        'bg-gray-700/20 text-gray-400'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No content scheduled for this date</p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button
              onClick={handleGenerateMonthContent}
              className="bg-allendale-gold text-black hover:bg-allendale-gold/80"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Generate Month Content
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="border-allendale-gold/30 text-allendale-gold hover:bg-allendale-gold/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Manual Entry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCalendar;
