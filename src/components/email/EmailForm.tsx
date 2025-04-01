
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailFormProps {
  onGenerate: (content: { subject: string; body: string }) => void;
}

const EmailForm = ({ onGenerate }: EmailFormProps) => {
  const [topic, setTopic] = useState("");
  const [emailType, setEmailType] = useState("promotion");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your email",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to OpenAI
    setTimeout(() => {
      let subject = "";
      let body = "";
      
      switch (emailType) {
        case "promotion":
          subject = `Introducing: ${topic} - A Special Offer for Our Valued Guests`;
          body = `Dear Allendale Social Guest,

We're thrilled to introduce our ${topic}, created specially for our discerning patrons like you.

This week only, when you dine with us and mention this email, you'll receive a complimentary dessert with your meal as our way of thanking you for your continued support.

Reserve your table now to take advantage of this limited-time offer. We look forward to welcoming you to Allendale Social soon.

Warm regards,
The Allendale Social Team

resy.com/cities/all/allendale-social`;
          break;
        case "event":
          subject = `Join Us for ${topic} at Allendale Social`;
          body = `Dear Allendale Social Guest,

You're cordially invited to join us for ${topic} at Allendale Social.

Date: [Insert Date]
Time: [Insert Time]
Reservation: Required

Experience an unforgettable evening of exceptional cuisine, carefully selected wines, and live entertainment in our elegant setting.

Spaces are limited, so we recommend securing your reservation early to avoid disappointment.

We look forward to hosting you for this special occasion.

Best regards,
The Allendale Social Team

resy.com/cities/all/allendale-social`;
          break;
        case "newsletter":
          subject = `Allendale Social Monthly Newsletter - Featuring ${topic}`;
          body = `Dear Allendale Social Guest,

We hope this message finds you well. Here's what's happening this month at Allendale Social:

FEATURED HIGHLIGHT: ${topic}
[Description of the featured topic]

UPCOMING EVENTS:
• Live Music Friday - Every Friday, 8pm
• Wine Tasting - Second Saturday of the month
• Chef's Table Experience - Reservations required

NEW ON THE MENU:
Our chef has created some exciting new dishes for the season. Come try our [dish 1], [dish 2], and [dish 3].

BEHIND THE SCENES:
[Brief story about something interesting happening at the restaurant]

We look forward to welcoming you back to Allendale Social soon.

Warm regards,
The Allendale Social Team

resy.com/cities/all/allendale-social`;
          break;
        default:
          subject = `Allendale Social - ${topic}`;
          body = `Information about ${topic} at Allendale Social.`;
      }
      
      onGenerate({ subject, body });
      setLoading(false);
      
      toast({
        title: "Email generated!",
        description: "Your email content is ready to use.",
      });
    }, 1500);
  };

  return (
    <Card className="border-allendale-gold/20 bg-allendale-black/50">
      <CardHeader>
        <CardTitle className="text-lg text-allendale-gold font-serif">Generate Email</CardTitle>
        <CardDescription>
          Create marketing emails powered by AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerateEmail} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-200">Email Type</label>
            <Select
              value={emailType}
              onValueChange={setEmailType}
            >
              <SelectTrigger className="bg-allendale-black border-allendale-gold/30">
                <SelectValue placeholder="Select email type" />
              </SelectTrigger>
              <SelectContent className="bg-allendale-black border-allendale-gold/30">
                <SelectItem value="promotion">Promotional Offer</SelectItem>
                <SelectItem value="event">Event Invitation</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="announcement">Special Announcement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-200">Topic/Focus</label>
            <Input 
              placeholder="e.g. New summer menu, Weekend wine tasting event"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-allendale-black border-allendale-gold/30"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-allendale-gold text-black hover:bg-allendale-gold/80"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Generate Email
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailForm;
