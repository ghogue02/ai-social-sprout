
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentFormProps {
  onGenerate: (content: string) => void;
}

const ContentForm = ({ onGenerate }: ContentFormProps) => {
  const [contentType, setContentType] = useState("instagram-post");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your content",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to OpenAI
    // In a real implementation, this would call your OpenAI service
    setTimeout(() => {
      let generatedContent = "";
      
      switch (contentType) {
        case "instagram-post":
          generatedContent = `✨ EXPERIENCE ALLENDALE SOCIAL ✨\n\nIndulge in our ${topic} that's taking the town by storm! Expertly crafted with premium ingredients and served in our elegant atmosphere.\n\nJoin us this weekend and see why we're becoming the destination for fine dining and exceptional drinks in the area.\n\n#AllendaleSocial #FineDining #Cocktails #${topic.replace(/\s+/g, '')}`;
          break;
        case "facebook-post":
          generatedContent = `🍽️ NEW AT ALLENDALE SOCIAL 🍽️\n\nWe're excited to introduce our ${topic} to our discerning guests. Our chef has created something truly special that pairs perfectly with our carefully curated wine selection.\n\nMake your reservation today and be among the first to experience this culinary delight!\n\nBook online: resy.com/cities/all/allendale-social`;
          break;
        case "email-campaign":
          generatedContent = `Subject: Experience Our New ${topic} - Exclusive for Our Valued Guests\n\nDear Allendale Social Guest,\n\nWe're delighted to invite you to experience our new ${topic}, crafted specially for our discerning patrons.\n\nThis limited-time offering brings together the finest ingredients, expertly prepared by our award-winning chef to create a dining experience you won't soon forget.\n\nReserve your table now to ensure you don't miss out on this exceptional addition to our menu.\n\nWarm regards,\nThe Allendale Social Team`;
          break;
        default:
          generatedContent = `Check out our amazing new ${topic} at Allendale Social! We can't wait for you to try it.`;
      }
      
      onGenerate(generatedContent);
      setLoading(false);
      
      toast({
        title: "Content generated!",
        description: "Your marketing content is ready to use.",
      });
    }, 1500);
  };

  return (
    <Card className="border-allendale-gold/20 bg-allendale-black/50">
      <CardHeader>
        <CardTitle className="text-lg text-allendale-gold font-serif">Generate Content</CardTitle>
        <CardDescription>
          Create marketing content powered by AI for your restaurant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerateContent} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-200">Content Type</label>
            <Select
              value={contentType}
              onValueChange={setContentType}
            >
              <SelectTrigger className="bg-allendale-black border-allendale-gold/30">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent className="bg-allendale-black border-allendale-gold/30">
                <SelectItem value="instagram-post">Instagram Post</SelectItem>
                <SelectItem value="facebook-post">Facebook Post</SelectItem>
                <SelectItem value="tweet">Tweet</SelectItem>
                <SelectItem value="email-campaign">Email Campaign</SelectItem>
                <SelectItem value="menu-description">Menu Description</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-200">Topic/Focus</label>
            <Input 
              placeholder="e.g. Weekend cocktail special, New seasonal menu"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-allendale-black border-allendale-gold/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-200">Tone</label>
            <Select
              value={tone}
              onValueChange={setTone}
            >
              <SelectTrigger className="bg-allendale-black border-allendale-gold/30">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent className="bg-allendale-black border-allendale-gold/30">
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
              </SelectContent>
            </Select>
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
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentForm;
