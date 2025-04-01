import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Check, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImagePreviewProps {
  imageUrl: string | null;
}

const ImagePreview = ({ imageUrl }: ImagePreviewProps) => {
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleSaveImage = () => {
    setSaved(true);
    
    toast({
      title: "Image saved!",
      description: "Your image has been saved to your library.",
    });
    
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handleDownloadImage = () => {
    if (imageUrl) {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'allendale-social-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started!",
        description: "Your image is being downloaded.",
      });
    }
  };

  return (
    <Card className="border-allendale-gold/20 bg-allendale-black/50 h-full">
      <CardHeader>
        <CardTitle className="text-lg text-allendale-gold font-serif">Image Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {imageUrl ? (
            <>
              <div className="border border-allendale-gold/30 rounded-md overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Generated content" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleDownloadImage}
                  variant="outline"
                  className="border-allendale-gold/30 text-allendale-gold hover:bg-allendale-gold/10"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                
                <Button
                  onClick={handleSaveImage}
                  variant="outline"
                  className="border-allendale-gold/30 text-allendale-gold hover:bg-allendale-gold/10"
                >
                  {saved ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Share2 className="mr-2 h-4 w-4" />
                      Save to Library
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] border border-dashed border-allendale-gold/30 rounded-md text-center text-gray-400 p-4">
              <ImageIcon className="h-16 w-16 text-gray-500 mb-4" />
              <p>Generated image will appear here</p>
              <p className="text-sm mt-2">Use the form to create images for your marketing needs</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePreview;
