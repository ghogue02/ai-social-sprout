
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
import { Loader, ImageIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ImageGenerationFormProps {
  onGenerate: (imageUrl: string) => void;
}

const ImageGenerationForm = ({ onGenerate }: ImageGenerationFormProps) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt) {
      toast({
        title: "Description required",
        description: "Please enter a description for your image",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to OpenAI DALL-E
    // In a real implementation, this would call your OpenAI service
    setTimeout(() => {
      // Using one of the provided images as a placeholder
      // In a real app, this would be the URL returned from DALL-E
      const demoImages = [
        "/lovable-uploads/114459a1-d024-4baa-a7d7-b79af7498faf.png",
        "/lovable-uploads/f55e7e77-60cb-4f48-bc68-eb3e9d21e114.png",
        "/lovable-uploads/e2054355-0b65-49d0-9d6b-dec4eab7ec3f.png"
      ];
      
      // Select a random image from the demo images
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
      
      onGenerate(randomImage);
      setLoading(false);
      
      toast({
        title: "Image generated!",
        description: "Your marketing image is ready to use.",
      });
    }, 2000);
  };

  return (
    <Card className="border-allendale-gold/20 bg-allendale-black/50">
      <CardHeader>
        <CardTitle className="text-lg text-allendale-gold font-serif">Generate Images</CardTitle>
        <CardDescription>
          Create AI-generated images for your restaurant's marketing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerateImage} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-200">Image Description</label>
            <Textarea
              placeholder="Describe the image you want to generate, e.g. 'A beautifully plated dish of pasta with a glass of red wine in a restaurant setting'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-allendale-black border-allendale-gold/30 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-200">Image Style</label>
            <Select
              value={style}
              onValueChange={setStyle}
            >
              <SelectTrigger className="bg-allendale-black border-allendale-gold/30">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent className="bg-allendale-black border-allendale-gold/30">
                <SelectItem value="realistic">Realistic Photography</SelectItem>
                <SelectItem value="artistic">Artistic</SelectItem>
                <SelectItem value="minimalist">Minimalist</SelectItem>
                <SelectItem value="vibrant">Vibrant and Colorful</SelectItem>
                <SelectItem value="vintage">Vintage/Retro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-200">Width</label>
              <Select defaultValue="1024">
                <SelectTrigger className="bg-allendale-black border-allendale-gold/30">
                  <SelectValue placeholder="Width" />
                </SelectTrigger>
                <SelectContent className="bg-allendale-black border-allendale-gold/30">
                  <SelectItem value="512">512px</SelectItem>
                  <SelectItem value="1024">1024px</SelectItem>
                  <SelectItem value="1536">1536px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-200">Height</label>
              <Select defaultValue="1024">
                <SelectTrigger className="bg-allendale-black border-allendale-gold/30">
                  <SelectValue placeholder="Height" />
                </SelectTrigger>
                <SelectContent className="bg-allendale-black border-allendale-gold/30">
                  <SelectItem value="512">512px</SelectItem>
                  <SelectItem value="1024">1024px</SelectItem>
                  <SelectItem value="1536">1536px</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImageGenerationForm;
